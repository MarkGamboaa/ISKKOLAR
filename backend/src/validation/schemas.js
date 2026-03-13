import Joi from 'joi';

const EMAIL_MESSAGE = 'Please provide a valid email address';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const MOBILE_PATTERN = /^\d{7,15}$/;

const requiredText = (label) =>
  Joi.string().required().messages({
    'string.empty': `${label} is required`,
    'any.required': `${label} is required`
  });

const optionalText = () => Joi.string().allow('', null);

const emailField = () =>
  Joi.string().email().required().messages({
    'string.email': EMAIL_MESSAGE,
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  });

const passwordField = (minMessage) =>
  Joi.string().min(8).required().pattern(PASSWORD_PATTERN).messages({
    'string.empty': 'Password is required',
    'string.min': minMessage,
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required'
  });

const stepPasswordField = () =>
  Joi.string().min(8).pattern(PASSWORD_PATTERN).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, and number',
    'any.required': 'Password is required'
  });

const confirmPasswordField = (label = 'Confirm password') =>
  Joi.string().empty('').valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': `${label} is required`,
    'any.required': `${label} is required`
  });

const enumField = (values, label, invalidMessage) =>
  Joi.string().empty('').valid(...values).required().messages({
    'any.only': invalidMessage,
    'any.required': `${label} is required`
  });

const mobileField = (patternMessage) =>
  Joi.string().pattern(MOBILE_PATTERN).required().messages({
    'string.pattern.base': patternMessage,
    'string.empty': 'Mobile number is required',
    'any.required': 'Mobile number is required'
  });

export const signUpValidation = Joi.object({
  email: emailField(),
  password: passwordField('Password must be at least 8 characters long'),
  confirmPassword: confirmPasswordField('Confirm password'),
  firstName: requiredText('First name'),
  middleName: optionalText(),
  lastName: requiredText('Last name'),
  suffix: optionalText(),
  birthday: requiredText('Birthday'),
  gender: enumField(['Male', 'Female'], 'Gender', 'Gender must be Male or Female'),
  civilStatus: enumField(['Single', 'Married'], 'Civil status', 'Civil status must be Single or Married'),
  citizenship: requiredText('Citizenship'),
  mobileNumber: mobileField('Mobile number must contain 7 to 15 digits'),
  facebook: optionalText(),
  street: requiredText('Street/Unit'),
  barangay: requiredText('Barangay'),
  city: requiredText('City'),
  province: requiredText('Province'),
  country: requiredText('Country'),
  zipCode: requiredText('Zip code'),
  userType: enumField(
    ['scholar', 'staff', 'admin', 'applicant'],
    'User type',
    'User type must be one of: scholar, staff, admin, applicant'
  )
});

export const loginValidation = Joi.object({
  email: emailField(),
  password: requiredText('Password')
});

export const forgotPasswordValidation = Joi.object({
  email: emailField()
});

export const updateProfileValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  province: Joi.string(),
  zipCode: Joi.string()
});

const signUpStepOneValidation = Joi.object({
  email: emailField(),
  password: stepPasswordField(),
  confirmPassword: confirmPasswordField('Confirm Password')
});

const signUpStepTwoValidation = Joi.object({
  firstName: requiredText('First name'),
  middleName: optionalText(),
  lastName: requiredText('Last name'),
  suffix: optionalText(),
  birthday: requiredText('Birthday'),
  gender: enumField(['Male', 'Female'], 'Gender', 'Gender must be either Male or Female'),
  civilStatus: enumField(['Single', 'Married'], 'Civil status', 'Civil status must be either Single or Married'),
  citizenship: requiredText('Citizenship')
});

const signUpStepThreeValidation = Joi.object({
  mobileNumber: mobileField('Please provide a valid mobile number'),
  facebook: optionalText(),
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

  const { error } = schema.validate(payload, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false
  });

  if (!error) {
    return { success: true, errors: [] };
  }

  return {
    success: false,
    errors: error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message
    }))
  };
};
