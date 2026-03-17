import Joi from 'joi';

// ─── Constants ───────────────────────────────────────────────
export const ALLOWED_DOC_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const MAX_DOC_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const REQUIRED_DOCUMENT_TYPES = [
  'grade_report',
  'cor',
  'current_term_report',
  'certificate_of_indigency',
  'birth_certificate',
  'income_cert_father',
  'income_cert_mother',
  'essay',
];

export const OPTIONAL_DOCUMENT_TYPES = ['recommendation_letter'];

// ─── Reusable sub-schemas ─────────────────────────────────────
const familyMemberSchema = Joi.object({
  role: Joi.string().valid('father', 'mother', 'other').required().messages({
    'any.required': 'Role is required',
    'any.only': 'Invalid role',
  }),
  full_name: Joi.string().trim().min(2).max(255).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name is too short',
    'any.required': 'Name is required',
  }),
  employment_status: Joi.string()
    .valid('Employed', 'Unemployed', 'Self-Employed')
    .required()
    .messages({
      'any.only': 'Invalid employment status',
      'any.required': 'Employment status is required',
    }),
  occupation: Joi.when('employment_status', {
    is: Joi.valid('Employed', 'Self-Employed'),
    then: Joi.string().trim().min(2).max(255).required().messages({
      'string.base': 'Occupation is required',
      'string.min': 'Occupation is too short',
      'string.max': 'Occupation is too long',
      'any.required': 'Occupation is required',
    })
  }),
  monthly_income: Joi.when('employment_status', {
    is: Joi.valid('Employed', 'Self-Employed'),
    then: Joi.number().min(0).required().messages({
      'number.base': 'Monthly income is required',
      'number.min': 'Monthly income cannot be negative',
    }),
    otherwise: Joi.number().min(0).allow('', null),
  }),
});

// ─── Step 1: Academic Information ────────────────────────────
export const tertiaryStep1Validation = Joi.object({
  // Scholarship info
  scholarship_type: Joi.string()
    .messages({ 'any.only': 'Invalid scholarship type' }),

    incoming_freshman: Joi.boolean().required().messages({
      'boolean.base': 'Incoming freshman field must be true or false',
      'any.required': 'Incoming freshman field is required',
    }),

  // Secondary education
  secondary_school: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Secondary school name is required',
  }),
  strand: Joi.string()
    .required()
    .messages({ 'any.only': 'Invalid strand' }),
    year_graduated: Joi.number()
    .integer()
    .min(1950)
    .max(new Date().getFullYear())
    .required()
    .messages({ 'number.max': 'Year graduated cannot be in the future' }),

  // Tertiary education
  tertiary_school: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Tertiary school name is required',
  }),
  program: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Program is required',
  }),
  term_type: Joi.string()
    .required(),
  grade_scale: Joi.string()
    .required(),
  year_level: Joi.string()
    .required(),
  term: Joi.string()
    .required(),
  expected_graduation_year: Joi.number()
    .integer()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 10)
    .required()
    .messages({
      'number.base': 'Expected graduation year is required',
      'number.min': `Expected graduation year must be ${new Date().getFullYear()} or later`,
      'number.max': 'Expected graduation year seems too far in the future',
    }),
}).custom((value, helpers) => {
  // cross-field: term options depend on term_type
  const validTerms = {
    Semester: ['1st', '2nd'],
    Trimester: ['1st', '2nd', '3rd'],
    'Quarter System': ['1st', '2nd', '3rd', '4th'],
  };
  if (!validTerms[value.term_type]?.includes(value.term)) {
    return helpers.error('any.invalid', {
      message: `Term "${value.term}" is not valid for ${value.term_type}`,
    });
  }
  return value;
});

// ─── Step 2: Family Information ───────────────────────────────
export const tertiaryStep2Validation = Joi.object({
  family_members: Joi.array()
    .items(familyMemberSchema)
    .min(2)
    .required()
    .custom((members, helpers) => {
      const roles = members.map((m) => m.role);
      if (!roles.includes('father'))
        return helpers.error('any.custom', {
          custom: 'Father info is required',
        });
      if (!roles.includes('mother'))
        return helpers.error('any.custom', {
          custom: 'Mother info is required',
        });
      return members;
    })
    .messages({
      'array.base': 'Family info is required',
      'array.min': 'Add at least father and mother',
      'any.required': 'Family info is required',
      'any.custom': '{{#custom}}',
    }),
});

// ─── Step 3: handled in middleware (file validation) ─────────

// ─── Full submission: Step 1 + Step 2 combined ────────────────
export const tertiarySubmitValidation = tertiaryStep1Validation.concat(
  tertiaryStep2Validation
);

// ─── Step map for validate-step endpoint ─────────────────────
export const TERTIARY_STEP_VALIDATORS = {
  1: tertiaryStep1Validation,
  2: tertiaryStep2Validation,
};