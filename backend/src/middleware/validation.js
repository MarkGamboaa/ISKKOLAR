import {
  REQUIRED_DOCUMENT_TYPES,
  TERTIARY_STEP_VALIDATORS,
  tertiarySubmitValidation,
} from '../validation/scholarshipValidation.js';

// Validation middleware
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

const STEP_REQUIRED_DOCUMENT_TYPES = {
  1: ['grade_report', 'cor', 'current_term_report'],
  3: ['certificate_of_indigency', 'birth_certificate', 'income_cert_father', 'income_cert_mother', 'essay'],
};

const missingRequiredDocs = (uploadedFiles, requiredTypes) => {
  return requiredTypes.filter((type) => !uploadedFiles[type]);
};

const toSentenceCase = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const requiredDocsForStep = (step, incomingFreshman) => {
  const required = STEP_REQUIRED_DOCUMENT_TYPES[step] || [];
  return incomingFreshman
    ? required.filter((doc) => doc !== 'current_term_report')
    : required;
};

const requiredDocsForSubmission = (incomingFreshman) => {
  return incomingFreshman
    ? REQUIRED_DOCUMENT_TYPES.filter((doc) => doc !== 'current_term_report')
    : REQUIRED_DOCUMENT_TYPES;
};

export const normalizeTertiaryRequestBody = (req, res, next) => {
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

export const validateTertiaryStepPayload = (req, res, next) => {
  const step = Number(req.query.step);
  req.tertiaryStep = step;
  req.tertiaryValidationErrors = [];

  if (![1, 2, 3].includes(step)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid step. Must be 1, 2, or 3',
    });
  }

  if (step === 3) {
    return next();
  }

  const schema = TERTIARY_STEP_VALIDATORS[step];
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const payloadErrors = result.error.errors.map((issue) => ({
      field: issue.path.join('.') || 'general',
      message: issue.message,
    }));

    // For step 1, continue so file validation can run and return a combined error list.
    if (step === 1) {
      req.tertiaryValidationErrors = payloadErrors;
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

export const validateTertiaryStepFiles = (req, res, next) => {
  const step = req.tertiaryStep ?? Number(req.query.step);
  if (![1, 3].includes(step)) {
    return next();
  }

  const uploadedFiles = req.files || {};
  const incomingFreshman = req.body.incoming_freshman === true;
  const missingDocs = missingRequiredDocs(
    uploadedFiles,
    requiredDocsForStep(step, incomingFreshman)
  );
  const payloadErrors = req.tertiaryValidationErrors || [];
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

export const validateTertiarySubmission = (req, res, next) => {
  const result = tertiarySubmitValidation.safeParse(req.body);

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
  const incomingFreshman = result.data.incoming_freshman === true;
  const missingDocs = missingRequiredDocs(
    uploadedFiles,
    requiredDocsForSubmission(incomingFreshman)
  );

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