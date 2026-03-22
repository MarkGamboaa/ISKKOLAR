import { z } from 'zod';

const EMAIL_MESSAGE = 'Please provide a valid email address';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const MOBILE_PATTERN = /^0\d{10}$/;
const FACEBOOK_PATTERN = /^https?:\/\/(www\.)?facebook\.com\/.+/;
export const PROFILE_PHOTO_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const PROFILE_PHOTO_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

// ─── Helper schemas ───────────────────────────────────────────
const emailField = () =>
  z.string()
    .min(1, 'Email is required')
    .email(EMAIL_MESSAGE);

const passwordField = (minMessage) =>
  z.string()
    .min(1, 'Password is required')
    .min(8, minMessage)
    .refine((val) => PASSWORD_PATTERN.test(val), {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    });

const stepPasswordField = () =>
  z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => PASSWORD_PATTERN.test(val), {
      message: 'Password must contain uppercase, lowercase, and number'
    });

const requiredText = (label) =>
  z.string()
    .min(1, `${label} is required`);

const optionalText = () => 
  z.string().optional().nullable();

const mobileField = (patternMessage) =>
  z.string()
    .min(1, 'Mobile number is required')
    .refine((val) => MOBILE_PATTERN.test(val), {
      message: patternMessage
    });

const profilePhotoMessage = (message) => ({ field: 'profilePhoto', message });

const normalizeFileSize = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const validateProfilePhotoMetadata = (profilePhoto) => {
  if (!profilePhoto) {
    return 'Upload profile photo is required';
  }

  if (!PROFILE_PHOTO_ALLOWED_MIME_TYPES.includes(profilePhoto.type)) {
    return 'Only JPEG and PNG images are allowed';
  }

  const fileSize = normalizeFileSize(profilePhoto.size);
  if (fileSize === null) {
    return 'Unable to validate profile photo';
  }

  if (fileSize > PROFILE_PHOTO_MAX_FILE_SIZE) {
    return 'File size exceeds the maximum limit of 5MB';
  }

  return null;
};

export const validateProfilePhotoFile = (profilePhoto) => {
  if (!profilePhoto) {
    return 'Upload profile photo is required';
  }

  if (!PROFILE_PHOTO_ALLOWED_MIME_TYPES.includes(profilePhoto.mimetype)) {
    return 'Only JPEG and PNG images are allowed';
  }

  const fileSize = normalizeFileSize(profilePhoto.size);
  if (fileSize !== null && fileSize > PROFILE_PHOTO_MAX_FILE_SIZE) {
    return 'File size exceeds the maximum limit of 5MB';
  }

  return null;
};

// ─── Full signup validation ────────────────────────────────────
export const signUpValidation = z.object({
  email: emailField(),
  password: passwordField('Password must be at least 8 characters long'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  firstName: requiredText('First name'),
  middleName: optionalText(),
  lastName: requiredText('Last name'),
  suffix: optionalText(),
  birthday: requiredText('Birthday'),
  gender: z.enum(['Male', 'Female'], { message: 'Gender must be Male or Female' }),
  civilStatus: z.enum(['Single', 'Married'], { message: 'Civil status must be Single or Married' }),
  citizenship: requiredText('Citizenship'),
  mobileNumber: mobileField('Mobile number must start with 0 and contain 11 digits'),
  facebook: z.string()
    .min(1, 'Facebook link is required')
    .refine((val) => FACEBOOK_PATTERN.test(val), {
      message: 'Facebook link must be a valid URL starting with http:// or https:// and contain facebook.com'
    }),
  street: requiredText('Street/Unit'),
  barangay: requiredText('Barangay'),
  city: requiredText('City'),
  province: requiredText('Province'),
  country: requiredText('Country'),
  zipCode: requiredText('Zip code'),
  userType: z.enum(['scholar', 'staff', 'admin', 'applicant'], {
    message: 'User type must be one of: scholar, staff, admin, applicant'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// ─── Login validation ──────────────────────────────────────────
export const loginValidation = z.object({
  email: emailField(),
  password: requiredText('Password')
});

// ─── Forgot password validation ────────────────────────────────
export const forgotPasswordValidation = z.object({
  email: emailField()
});

// ─── Update profile validation ─────────────────────────────────
export const updateProfileValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional()
});

// ─── Step-specific validations ────────────────────────────────── 
const signUpStepOneValidation = z.object({
  email: emailField(),
  password: stepPasswordField(),
  confirmPassword: z.string().min(1, 'Confirm Password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const signUpStepTwoValidation = z.object({
  firstName: requiredText('First name'),
  middleName: optionalText(),
  lastName: requiredText('Last name'),
  suffix: optionalText(),
  birthday: requiredText('Birthday'),
  gender: z.enum(['Male', 'Female'], { message: 'Gender must be either Male or Female' }),
  civilStatus: z.enum(['Single', 'Married'], { message: 'Civil status must be either Single or Married' }),
  citizenship: requiredText('Citizenship')
});

const signUpStepThreeValidation = z.object({
  mobileNumber: mobileField('Mobile number must start with 0 and contain 11 digits'),
  facebook: z.string()
    .min(1, 'Facebook link is required')
    .refine((val) => FACEBOOK_PATTERN.test(val), {
      message: 'Facebook link must be a valid URL starting with http:// or https:// and contain facebook.com'
    }),
  street: requiredText('Street'),
  barangay: requiredText('Barangay'),
  city: requiredText('City'),
  province: requiredText('Province'),
  country: requiredText('Country'),
  zipCode: requiredText('Zip code')
});

export const validateSignupStepPayload = (step, payload) => {
  const schemaMap = {
    1: signUpStepOneValidation,
    2: signUpStepTwoValidation,
    3: signUpStepThreeValidation
  };

  const schema = schemaMap[step];
  if (!schema) {
    return {
      success: false,
      errors: [{ field: 'step', message: 'Invalid step. Must be 1, 2, or 3.' }]
    };
  }

  const result = schema.safeParse(payload);
  
  const errors = [];
  
  if (!result.success) {
    result.error.errors.forEach((issue) => {
      errors.push({
        field: issue.path.join('.') || 'general',
        message: issue.message
      });
    });
  }

  if (step === 2) {
    const profilePhotoError = validateProfilePhotoMetadata(payload.profilePhoto);
    if (profilePhotoError) {
      errors.push(profilePhotoMessage(profilePhotoError));
    }
  }

  if (errors.length === 0) {
    return { success: true, errors: [] };
  }

  return {
    success: false,
    errors
  };
};
