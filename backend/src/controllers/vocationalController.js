import { supabaseAdmin as supabase } from '../config/supabase.js';
import {
  VOCATIONAL_REQUIRED_DOCUMENT_TYPES,
  VOCATIONAL_OPTIONAL_DOCUMENT_TYPES,
  checkOngoingApplication,
} from '../validation/scholarshipValidation.js';
import { uploadAllDocuments } from '../services/applicationServices.js';

// ─── Helper: upload all docs and build insert rows ───────────
const uploadVocationalDocuments = async (uploadedFiles, applicationId) => {
  return uploadAllDocuments(
    uploadedFiles,
    applicationId,
    VOCATIONAL_REQUIRED_DOCUMENT_TYPES,
    VOCATIONAL_OPTIONAL_DOCUMENT_TYPES
  );
};

// ────────────────────────────────────────────────────────────
// POST /api/scholarships/vocational/validate-step?step=1|2|3
// ────────────────────────────────────────────────────────────
export const validateVocationalStep = (req, res) => {
  const step = req.vocationalStep || parseInt(req.query.step, 10);
  return res.status(200).json({ success: true, step });
};

// ────────────────────────────────────────────────────────────
// POST /api/scholarships/vocational/apply
// ────────────────────────────────────────────────────────────
export const submitVocationalApplication = async (req, res) => {
  const userId = req.user.userId || req.user.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized request',
    });
  }

  // Check for ongoing applications
  try {
    const ongoingApp = await checkOngoingApplication(supabase, userId);
    if (ongoingApp) {
      return res.status(400).json({
        success: false,
        message: `You already have an ongoing ${ongoingApp.application_type} scholarship application in ${ongoingApp.status} status. Complete or withdraw it before applying for a new one.`,
        existingApplication: ongoingApp,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      stage: 'check_ongoing_application',
      message: err.message,
    });
  }

  const uploadedFiles = req.files || {};
  const submissionPayload = req.body;
  const family_members = submissionPayload.family_members;

  // 2. Insert base application
  const { data: application, error: appError } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      application_type: 'vocational',
      fund_type: submissionPayload.fund_type ?? null,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (appError) {
    return res.status(500).json({
      success: false,
      stage: 'insert_application',
      message: appError.message,
      dbError: {
        code: appError.code,
        details: appError.details,
        hint: appError.hint,
      },
    });
  }

  const applicationId = application.id;
  let failureStage = 'initialization';

  try {
    failureStage = 'insert_vocational_application_details';
    // 3. Insert vocational application details
    const { error: detailError } = await supabase
      .from('vocational_application_details')
      .insert({
        application_id: applicationId,
        scholarship_type: submissionPayload.scholarship_type,
      });
    if (detailError) throw new Error(detailError.message);

    failureStage = 'insert_secondary_education';
    // 4. Insert secondary education
    const { error: secError } = await supabase
      .from('secondary_education')
      .insert({
        application_id: applicationId,
        school_name: submissionPayload.secondary_school,
        strand: submissionPayload.strand,
        year_graduated: parseInt(submissionPayload.year_graduated, 10),
      });
    if (secError) throw new Error(secError.message);

    failureStage = 'insert_vocational_education';
    // 5. Insert vocational education
    const { error: vocError } = await supabase
      .from('vocational_education')
      .insert({
        application_id: applicationId,
        school_name: submissionPayload.vocational_school,
        program: submissionPayload.vocational_program,
        course_duration: submissionPayload.course_duration,
        completion_date: submissionPayload.completion_date,
      });
    if (vocError) throw new Error(vocError.message);

    failureStage = 'insert_family_members';
    // 6. Insert family members (bulk)
    const { error: familyError } = await supabase
      .from('family_members')
      .insert(
        family_members.map((m) => ({
          ...m,
          application_id: applicationId,
        }))
      );
    if (familyError) throw new Error(familyError.message);

    failureStage = 'upload_and_insert_documents';
    // 7. Upload docs to storage + insert records
    const docInserts = await uploadVocationalDocuments(uploadedFiles, applicationId);
    const { error: docError } = await supabase
      .from('application_documents')
      .insert(docInserts);
    if (docError) throw new Error(docError.message);

  } catch (err) {
    // Rollback: delete base application (cascades to all detail tables)
    await supabase.from('applications').delete().eq('id', applicationId);

    return res.status(500).json({
      success: false,
      stage: failureStage,
      message: err.message || 'Submission failed. Please try again.',
      dbError: err?.code
        ? {
            code: err.code,
            details: err.details,
            hint: err.hint,
          }
        : undefined,
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Vocational scholarship application submitted successfully',
    data: { application_id: applicationId },
  });
};

// ────────────────────────────────────────────────────────────
// GET /api/scholarships/vocational/my-applications
// ────────────────────────────────────────────────────────────
export const getMyVocationalApplications = async (req, res) => {
  const userId = req.user.userId || req.user.id;

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id, status, submitted_at, created_at,
      vocational_application_details ( scholarship_type ),
      secondary_education ( school_name, strand, year_graduated ),
      vocational_education ( school_name, program, course_duration ),
      application_documents ( document_type, file_name, is_required )
    `)
    .eq('user_id', userId)
    .eq('application_type', 'vocational')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(200).json({ success: true, data });
};

// ────────────────────────────────────────────────────────────
// GET /api/scholarships/vocational/:id
// ────────────────────────────────────────────────────────────
export const getVocationalApplicationById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId || req.user.id;

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      vocational_application_details (*),
      secondary_education (*),
      vocational_education (*),
      family_members (*),
      application_documents (*)
    `)
    .eq('id', id)
    .eq('user_id', userId)       // ownership check — prevents IDOR
    .eq('application_type', 'vocational')
    .single();

  if (error || !data) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  return res.status(200).json({ success: true, data });
};
