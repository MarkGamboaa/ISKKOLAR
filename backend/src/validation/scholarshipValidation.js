import Joi from 'joi';

// ─── Constants ───────────────────────────────────────────────
export const ALLOWED_DOC_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
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
  role: Joi.string().valid('father', 'mother', 'other').required(),
  full_name: Joi.string().min(2).max(255).required(),
  employment_status: Joi.string()
    .valid('Employed', 'Unemployed', 'Self-Employed')
    .required(),
  occupation: Joi.string().max(255).allow('', null),
  monthly_income: Joi.number().min(0).allow(null),
});

// ─── Step 1: Academic Information ────────────────────────────
export const tertiaryStep1Validation = Joi.object({
  // Scholarship info
  scholarship_type: Joi.string()
    .valid('Manila Scholars', 'Bulacan Scholars', 'Nationwide Scholars')
    .required()
    .messages({ 'any.only': 'Invalid scholarship type' }),

  fund_type: Joi.string()
    .valid('KKFI Funded', 'Partner Funded')
    .required()
    .messages({ 'any.only': 'Invalid fund type' }),

  incoming_freshman: Joi.boolean().required().messages({
    'any.required': 'Please specify if you are an incoming freshman',
  }),

  // Secondary education
  secondary_school: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Secondary school name is required',
  }),
  strand: Joi.string()
    .valid('STEM', 'ABM', 'HUMSS', 'GAS', 'TVL')
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
    .valid('Semester', 'Trimester', 'Quarter System')
    .required(),
  grade_scale: Joi.string()
    .valid(
      '1.0 - 5.00 Grading System',
      '4.00 GPA System',
      'Percentage System',
      'Letter Grade System'
    )
    .required(),
  year_level: Joi.string()
    .valid('1st', '2nd', '3rd', '4th')
    .required(),
  term: Joi.string()
    .valid('1st', '2nd', '3rd', '4th')
    .required(),
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
        return helpers.error('any.invalid', {
          message: "Father's information is required",
        });
      if (!roles.includes('mother'))
        return helpers.error('any.invalid', {
          message: "Mother's information is required",
        });
      return members;
    })
    .messages({
      'array.min': 'At least father and mother information is required',
    }),
});

// ─── Step 3: handled in controller (file validation) ─────────

// ─── Full submission: Step 1 + Step 2 combined ────────────────
export const tertiarySubmitValidation = tertiaryStep1Validation.concat(
  tertiaryStep2Validation
);

// ─── Step map for validate-step endpoint ─────────────────────
export const TERTIARY_STEP_VALIDATORS = {
  1: tertiaryStep1Validation,
  2: tertiaryStep2Validation,
};