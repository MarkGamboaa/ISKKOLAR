import { z } from 'zod';

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
const parseOptionalText = (value) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return value;
};

const parseOptionalNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

// ─── SHARED FAMILY MEMBER SCHEMA (used by tertiary & vocational) ──
export const familyMemberSchema = z.object({
  role: z.enum(['father', 'mother', 'other'], {
    message: 'Invalid role'
  }),
  full_name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name is too short')
    .max(255, 'Name is too long'),
  employment_status: z.enum(['Employed', 'Unemployed', 'Self-Employed', 'Deceased'], {
    message: 'Invalid employment status'
  }),
  occupation: z.preprocess(
    parseOptionalText,
    z.string({ invalid_type_error: 'Occupation must be a valid text value' })
      .min(2, 'Occupation is too short')
      .max(255, 'Occupation is too long')
      .optional()
  ),
  monthly_income: z.preprocess(
    parseOptionalNumber,
    z.number({ invalid_type_error: 'Monthly income must be a valid number' })
      .min(0, 'Monthly income cannot be negative')
      .optional()
  )
}).superRefine((data, ctx) => {
  const requiresWorkInfo = ['Employed', 'Self-Employed'].includes(data.employment_status);
  const shouldRemoveWorkInfo = ['Unemployed', 'Deceased'].includes(data.employment_status);

  if (requiresWorkInfo && !data.occupation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['occupation'],
      message: 'Occupation is required'
    });
  }

  if (requiresWorkInfo && data.monthly_income === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['monthly_income'],
      message: 'Monthly income is required'
    });
  }

  if (shouldRemoveWorkInfo && data.occupation !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['occupation'],
      message: 'Remove occupation when employment status is Unemployed or Deceased'
    });
  }

  if (shouldRemoveWorkInfo && data.monthly_income !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['monthly_income'],
      message: 'Remove monthly income when employment status is Unemployed or Deceased'
    });
  }
});

const parseYearInput = (value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

// ─── Step 1: Academic Information ────────────────────────────
export const tertiaryStep1Validation = z.object({
  scholarship_type: z.string().optional(),
  incoming_freshman: z.boolean({
    message: 'Incoming freshman field must be true or false'
  }),
  secondary_school: z.string()
    .min(1, 'Secondary school name is required')
    .min(2, 'Secondary school name is too short')
    .max(255, 'Secondary school name is too long'),
  strand: z.string().min(1, 'Strand is required'),
  year_graduated: z.preprocess(
    parseYearInput,
    z.number({
      required_error: 'Year graduated is required',
      invalid_type_error: 'Year graduated must be a valid year'
    })
    .int('Year graduated must be a whole year')
    .min(1950, 'Year graduated must be after 1950')
    .max(new Date().getFullYear(), 'Year graduated cannot be in the future')
  ),
  tertiary_school: z.string()
    .min(1, 'Tertiary school name is required')
    .min(2, 'Tertiary school name is too short')
    .max(255, 'Tertiary school name is too long'),
  program: z.string()
    .min(1, 'Program is required')
    .min(2, 'Program is too short')
    .max(255, 'Program is too long'),
  term_type: z.string().min(1, 'Term type is required'),
  grade_scale: z.string().min(1, 'Grade scale is required'),
  year_level: z.string().min(1, 'Year level is required'),
  term: z.string().min(1, 'Term is required'),
  expected_graduation_year: z.preprocess(
    parseYearInput,
    z.number({
      required_error: 'Expected graduation year is required',
      invalid_type_error: 'Expected graduation year must be a valid year'
    })
    .int('Expected graduation year must be a whole year')
    .min(new Date().getFullYear(), `Expected graduation year must be ${new Date().getFullYear()} or later`)
    .max(new Date().getFullYear() + 10, 'Expected graduation year seems too far in the future')
  )
}).refine(
  (data) => {
    // cross-field: term options depend on term_type
    const validTerms = {
      Semester: ['1st', '2nd'],
      Trimester: ['1st', '2nd', '3rd'],
      'Quarter System': ['1st', '2nd', '3rd', '4th'],
    };
    return validTerms[data.term_type]?.includes(data.term) ?? false;
  },
  {
    message: (data) => ({
      term: `Term "${data.term}" is not valid for ${data.term_type}`
    })
  }
);

// ─── Step 2: Family Information ───────────────────────────────
export const tertiaryStep2Validation = z.object({
  family_members: z.array(familyMemberSchema)
    .min(2, 'Add at least father and mother')
    .refine(
      (members) => members.some((m) => m.role === 'father'),
      'Father info is required'
    )
    .refine(
      (members) => members.some((m) => m.role === 'mother'),
      'Mother info is required'
    )
});

// ─── Full submission: Step 1 + Step 2 combined ────────────────
export const tertiarySubmitValidation = tertiaryStep1Validation.and(tertiaryStep2Validation);

// ─── Step map for validate-step endpoint ─────────────────────
export const TERTIARY_STEP_VALIDATORS = {
  1: tertiaryStep1Validation,
  2: tertiaryStep2Validation,
};

// ─── VOCATIONAL SCHOLARSHIP VALIDATION ────────────────────────

// ─── Step 1: Academic Information (similar to tertiary) ────────
export const vocationalStep1Validation = z.object({
  scholarship_type: z.string().optional(),
  secondary_school: z.string()
    .min(1, 'Secondary school name is required')
    .min(2, 'Secondary school name is too short')
    .max(255, 'Secondary school name is too long'),
  strand: z.string().min(1, 'Strand is required'),
  year_graduated: z.preprocess(
    parseYearInput,
    z.number({
      required_error: 'Year graduated is required',
      invalid_type_error: 'Year graduated must be a valid year'
    })
    .int('Year graduated must be a whole year')
    .min(1950, 'Year graduated must be after 1950')
    .max(new Date().getFullYear(), 'Year graduated cannot be in the future')
  ),
  vocational_school: z.string()
    .min(1, 'Vocational school name is required')
    .min(2, 'Vocational school name is too short')
    .max(255, 'Vocational school name is too long'),
  vocational_program: z.string()
    .min(1, 'Vocational program is required')
    .min(2, 'Vocational program is too short')
    .max(255, 'Vocational program is too long'),
  course_duration: z.string()
    .min(1, 'Course duration is required')
    .min(2, 'Course duration is too short')
    .max(50, 'Course duration is too long'),
  completion_date: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }
      return value;
    },
    z.string()
      .refine(
        (value) => !isNaN(Date.parse(value)),
        'Completion date must be a valid date'
      )
  )
});

// ─── Step 2: Family Information (reuses familyMemberSchema) ────
export const vocationalStep2Validation = z.object({
  family_members: z.array(familyMemberSchema)
    .min(2, 'Add at least father and mother')
    .refine(
      (members) => members.some((m) => m.role === 'father'),
      'Father info is required'
    )
    .refine(
      (members) => members.some((m) => m.role === 'mother'),
      'Mother info is required'
    )
});

// ─── Full submission: Step 1 + Step 2 combined ────────────────
export const vocationalSubmitValidation = vocationalStep1Validation.and(vocationalStep2Validation);

// ─── Step map for validate-step endpoint ─────────────────────
export const VOCATIONAL_STEP_VALIDATORS = {
  1: vocationalStep1Validation,
  2: vocationalStep2Validation,
};

// ─── Vocational required documents (same as tertiary except no current_term_report) ────
export const VOCATIONAL_REQUIRED_DOCUMENT_TYPES = [
  'grade_report',
  'cor',
  'certificate_of_indigency',
  'birth_certificate',
  'income_cert_father',
  'income_cert_mother',
  'essay',
];

export const VOCATIONAL_OPTIONAL_DOCUMENT_TYPES = ['recommendation_letter'];

// ─── ONGOING APPLICATION CHECK ────────────────────────────────
export const checkOngoingApplication = async (supabase, userId) => {
  const { data: ongoingApp, error } = await supabase
    .from('applications')
    .select('id, application_type, status')
    .eq('user_id', userId)
    .in('status', ['pending', 'under_review'])
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is fine
    throw new Error(error.message);
  }

  return ongoingApp;
};