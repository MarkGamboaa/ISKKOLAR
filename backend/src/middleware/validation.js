import {
  REQUIRED_DOCUMENT_TYPES,
  TERTIARY_STEP_VALIDATORS,
  tertiarySubmitValidation,
  VOCATIONAL_STEP_VALIDATORS,
  VOCATIONAL_REQUIRED_DOCUMENT_TYPES,
  vocationalSubmitValidation,
} from '../validation/scholarshipValidation.js';

// ─── GENERIC VALIDATION MIDDLEWARE ────────────────────────────

/**
 * Generic schema validator middleware
 * Used for auth and other general validation
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.errors.map(issue => ({
        field: issue.path.join('.') || 'general',
        message: issue.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    req.body = result.data;
    next();
  };
};

// ─── SCHOLARSHIP HELPERS ──────────────────────────────────────
const missingRequiredDocs = (uploadedFiles, requiredTypes) => {
  return requiredTypes.filter((type) => !uploadedFiles[type]);
};

const toSentenceCase = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// ─── SHARED MIDDLEWARE ────────────────────────────────────────

// Normalize request body — handle family_members JSON parsing
export const normalizeRequestBody = (req, res, next) => {
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

  if (body.incoming_freshman !== undefined && typeof body.incoming_freshman === 'string') {
    body.incoming_freshman = body.incoming_freshman === 'true';
  }

  req.body = body;
  next();
};

// Validate step payload — reusable factory
export const createStepValidator = (stepValidators, stepPrefix = '') => {
  return (req, res, next) => {
    const step = Number(req.query.step);
    req[`${stepPrefix}Step`] = step;
    req[`${stepPrefix}ValidationErrors`] = [];

    if (![1, 2, 3].includes(step)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step. Must be 1, 2, or 3',
      });
    }

    if (step === 3) {
      return next();
    }

    const schema = stepValidators[step];
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const payloadErrors = result.error.errors.map((issue) => ({
        field: issue.path.join('.') || 'general',
        message: issue.message,
      }));

      if (step === 1) {
        req[`${stepPrefix}ValidationErrors`] = payloadErrors;
        return next();
      }

      return res.status(400).json({
        success: false,
        step,
        errors: payloadErrors,
      });
    }

    req.body = result.data;
    next();
  };
};

// Validate step files — reusable factory
export const createStepFileValidator = (stepDocConfig, stepPrefix = '') => {
  return (req, res, next) => {
    const step = req[`${stepPrefix}Step`] ?? Number(req.query.step);
    if (![1, 3].includes(step)) {
      return next();
    }

    const uploadedFiles = req.files || {};
    const requiredTypes = stepDocConfig[step] || [];
    
    // For tertiary Step 1, filter docs if incoming_freshman is true
    let docsToCheck = requiredTypes;
    if (stepPrefix === 'tertiary' && step === 1 && req.body.incoming_freshman === true) {
      docsToCheck = requiredTypes.filter((doc) => doc !== 'current_term_report');
    }

    const missingDocs = missingRequiredDocs(uploadedFiles, docsToCheck);
    const payloadErrors = req[`${stepPrefix}ValidationErrors`] || [];
    const fileErrors = missingDocs.map((doc) => ({
      field: doc,
      message: `${toSentenceCase(doc.replaceAll('_', ' '))} is required`,
    }));

    if (payloadErrors.length > 0 || fileErrors.length > 0) {
      return res.status(400).json({
        success: false,
        step,
        errors: [...payloadErrors, ...fileErrors],
      });
    }

    next();
  };
};

// Validate full submission — reusable factory
export const createSubmissionValidator = (submitSchema, requiredDocs, stepPrefix = '', docFilter) => {
  return (req, res, next) => {
    const result = submitSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.errors.map((issue) => ({
          field: issue.path.join('.') || 'general',
          message: issue.message,
        })),
      });
    }

    const uploadedFiles = req.files || {};
    let docsNeeded = requiredDocs;

    // Apply filter if provided (e.g., for tertiary incoming_freshman)
    if (docFilter) {
      docsNeeded = docFilter(result.data, requiredDocs);
    }

    const missingDocs = missingRequiredDocs(uploadedFiles, docsNeeded);

    if (missingDocs.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required documents',
        errors: missingDocs.map((doc) => ({
          field: doc,
          message: `${toSentenceCase(doc.replaceAll('_', ' '))} is required`,
        })),
      });
    }

    req.body = result.data;
    next();
  };
};

// ─── TERTIARY-SPECIFIC CONFIGURATION ──────────────────────────
const TERTIARY_STEP_REQUIRED_DOCUMENT_TYPES = {
  1: ['grade_report', 'cor', 'current_term_report'],
  3: ['certificate_of_indigency', 'birth_certificate', 'income_cert_father', 'income_cert_mother', 'essay'],
};

const tertiaryRequiredDocsForSubmission = (data) => {
  return data.incoming_freshman
    ? REQUIRED_DOCUMENT_TYPES.filter((doc) => doc !== 'current_term_report')
    : REQUIRED_DOCUMENT_TYPES;
};

// ─── TERTIARY MIDDLEWARE ──────────────────────────────────────
export const normalizeTertiaryRequestBody = normalizeRequestBody;

export const validateTertiaryStepPayload = createStepValidator(TERTIARY_STEP_VALIDATORS, 'tertiary');

export const validateTertiaryStepFiles = createStepFileValidator(TERTIARY_STEP_REQUIRED_DOCUMENT_TYPES, 'tertiary');

export const validateTertiarySubmission = createSubmissionValidator(
  tertiarySubmitValidation,
  REQUIRED_DOCUMENT_TYPES,
  'tertiary',
  tertiaryRequiredDocsForSubmission
);

// ─── VOCATIONAL-SPECIFIC CONFIGURATION ────────────────────────
const VOCATIONAL_STEP_REQUIRED_DOCUMENT_TYPES = {
  1: ['grade_report', 'cor'],
  3: ['certificate_of_indigency', 'birth_certificate', 'income_cert_father', 'income_cert_mother', 'essay'],
};

// ─── VOCATIONAL MIDDLEWARE ────────────────────────────────────
export const normalizeVocationalRequestBody = normalizeRequestBody;

export const validateVocationalStepPayload = createStepValidator(VOCATIONAL_STEP_VALIDATORS, 'vocational');

export const validateVocationalStepFiles = createStepFileValidator(VOCATIONAL_STEP_REQUIRED_DOCUMENT_TYPES, 'vocational');

export const validateVocationalSubmission = createSubmissionValidator(
  vocationalSubmitValidation,
  VOCATIONAL_REQUIRED_DOCUMENT_TYPES,
  'vocational'
);