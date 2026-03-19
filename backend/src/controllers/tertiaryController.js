import { supabaseAdmin as supabase } from '../config/supabase.js';
import { uploadDocument } from '../services/storageServices.js';
import {
  REQUIRED_DOCUMENT_TYPES,
  OPTIONAL_DOCUMENT_TYPES,
} from '../validation/scholarshipValidation.js';

// ─── Helper: upload all docs and build insert rows ───────────
const uploadAllDocuments = async (uploadedFiles, applicationId) => {
  const allDocTypes = [...REQUIRED_DOCUMENT_TYPES, ...OPTIONAL_DOCUMENT_TYPES];
  const inserts = [];

  for (const docType of allDocTypes) {
    const fileArr = uploadedFiles[docType];
    if (!fileArr || !fileArr[0]) continue;

    const file = fileArr[0];
    const filePath = await uploadDocument(file, applicationId, docType);

    inserts.push({
      application_id: applicationId,
      document_type: docType,
      file_path: filePath,
      file_name: file.originalname,
      file_size: file.size,
      mime_type: file.mimetype,
      is_required: REQUIRED_DOCUMENT_TYPES.includes(docType),
    });
  }

  return inserts;
};

// ────────────────────────────────────────────────────────────
// POST /api/scholarships/tertiary/validate-step?step=1|2|3
// ────────────────────────────────────────────────────────────
export const validateTertiaryStep = (req, res) => {
  const step = req.tertiaryStep || parseInt(req.query.step, 10);
  return res.status(200).json({ success: true, step });
};

// ────────────────────────────────────────────────────────────
// POST /api/scholarships/tertiary/apply
// ────────────────────────────────────────────────────────────
export const submitTertiaryApplication = async (req, res) => {
  const userId = req.user.userId || req.user.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized request',
    });
  }

  const uploadedFiles = req.files || {};
  const submissionPayload = req.body;
  const incomingFreshman = submissionPayload.incoming_freshman;
  const family_members = submissionPayload.family_members;

  // 2. Insert base application
  const { data: application, error: appError } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      application_type: 'tertiary',
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
    failureStage = 'insert_tertiary_application_details';
    // 3. Insert tertiary application details
    const { error: detailError } = await supabase
      .from('tertiary_application_details')
      .insert({
        application_id: applicationId,
        scholarship_type: submissionPayload.scholarship_type,
        incoming_freshman: incomingFreshman,
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

    failureStage = 'insert_tertiary_education';
    // 5. Insert tertiary education
    const { error: tertError } = await supabase
      .from('tertiary_education')
      .insert({
        application_id: applicationId,
        school_name: submissionPayload.tertiary_school,
        program: submissionPayload.program,
        term_type: submissionPayload.term_type,
        grade_scale: submissionPayload.grade_scale,
        year_level: submissionPayload.year_level,
        term: submissionPayload.term,
        expected_graduation_year: parseInt(submissionPayload.expected_graduation_year, 10),
      });
    if (tertError) throw new Error(tertError.message);

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
    const docInserts = await uploadAllDocuments(uploadedFiles, applicationId);
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
    message: 'Tertiary scholarship application submitted successfully',
    data: { application_id: applicationId },
  });
};

// ────────────────────────────────────────────────────────────
// GET /api/scholarships/tertiary/my-applications
// ────────────────────────────────────────────────────────────
export const getMyTertiaryApplications = async (req, res) => {
  const userId = req.user.userId || req.user.id;

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id, status, submitted_at, created_at,
      tertiary_application_details ( scholarship_type, incoming_freshman ),
      secondary_education ( school_name, strand, year_graduated ),
      tertiary_education ( school_name, program, year_level, term ),
      application_documents ( document_type, file_name, is_required )
    `)
    .eq('user_id', userId)
    .eq('application_type', 'tertiary')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(200).json({ success: true, data });
};

// ────────────────────────────────────────────────────────────
// GET /api/scholarships/tertiary/:id
// ────────────────────────────────────────────────────────────
export const getTertiaryApplicationById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId || req.user.id;

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      tertiary_application_details (*),
      secondary_education (*),
      tertiary_education (*),
      family_members (*),
      application_documents (*)
    `)
    .eq('id', id)
    .eq('user_id', userId)       // ownership check — prevents IDOR
    .eq('application_type', 'tertiary')
    .single();

  if (error || !data) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  return res.status(200).json({ success: true, data });
};