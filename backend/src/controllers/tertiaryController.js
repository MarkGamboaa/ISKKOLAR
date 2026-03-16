import { supabaseAdmin as supabase } from '../config/supabase.js';
import { uploadDocument } from '../services/storageServices.js';
import {
  REQUIRED_DOCUMENT_TYPES,
  OPTIONAL_DOCUMENT_TYPES,
  TERTIARY_STEP_VALIDATORS,
} from '../validation/scholarshipValidation.js';

const parseIncomingFreshman = (value) => {
  if (typeof value === 'boolean') return value;
  return value === 'true';
};

// ─── Helper: validate required docs ─────────────────────────
const validateRequiredDocs = (uploadedFiles, incomingFreshman) => {
  // current_term_report not required for incoming freshmen
  const required = incomingFreshman
    ? REQUIRED_DOCUMENT_TYPES.filter((d) => d !== 'current_term_report')
    : REQUIRED_DOCUMENT_TYPES;

  return required.filter((type) => !uploadedFiles[type]);
};

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
  const step = parseInt(req.query.step);

  // Step 3 — file validation only
  if (step === 3) {
    const uploadedFiles = req.files || {};
    const incomingFreshman = parseIncomingFreshman(req.body.incoming_freshman);
    const missing = validateRequiredDocs(uploadedFiles, incomingFreshman);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        step: 3,
        errors: missing.map((doc) => ({
          field: doc,
          message: `${doc.replaceAll('_', ' ')} is required`,
        })),
      });
    }

    return res.status(200).json({ success: true, step: 3 });
  }

  // Steps 1 & 2 — Joi validation
  const schema = TERTIARY_STEP_VALIDATORS[step];
  if (!schema) {
    return res.status(400).json({
      success: false,
      message: 'Invalid step. Must be 1, 2, or 3',
    });
  }

  // family_members comes as JSON string from FormData
  const body = { ...req.body };
  if (body.family_members && typeof body.family_members === 'string') {
    try {
      body.family_members = JSON.parse(body.family_members);
    } catch {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'family_members', message: 'Invalid JSON format' }],
      });
    }
  }

  const { error } = schema.validate(body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      step,
      errors: error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }

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

  // parse family_members JSON string
  let family_members;
  try {
    family_members =
      typeof req.body.family_members === 'string'
        ? JSON.parse(req.body.family_members)
        : req.body.family_members;
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Invalid family_members format',
    });
  }

  const incomingFreshman = parseIncomingFreshman(req.body.incoming_freshman);

  // 1. Validate required documents
  const missingDocs = validateRequiredDocs(uploadedFiles, incomingFreshman);
  if (missingDocs.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required documents',
      errors: missingDocs.map((doc) => ({
        field: doc,
        message: `${doc.replaceAll('_', ' ')} is required`,
      })),
    });
  }

  // 2. Insert base application
  const { data: application, error: appError } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      application_type: 'tertiary',
      fund_type: req.body.fund_type,
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
        scholarship_type: req.body.scholarship_type,
        incoming_freshman: incomingFreshman,
      });
    if (detailError) throw new Error(detailError.message);

    failureStage = 'insert_secondary_education';
    // 4. Insert secondary education
    const { error: secError } = await supabase
      .from('secondary_education')
      .insert({
        application_id: applicationId,
        school_name: req.body.secondary_school,
        strand: req.body.strand,
        year_graduated: parseInt(req.body.year_graduated),
      });
    if (secError) throw new Error(secError.message);

    failureStage = 'insert_tertiary_education';
    // 5. Insert tertiary education
    const { error: tertError } = await supabase
      .from('tertiary_education')
      .insert({
        application_id: applicationId,
        school_name: req.body.tertiary_school,
        program: req.body.program,
        term_type: req.body.term_type,
        grade_scale: req.body.grade_scale,
        year_level: req.body.year_level,
        term: req.body.term,
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
      id, fund_type, status, submitted_at, created_at,
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