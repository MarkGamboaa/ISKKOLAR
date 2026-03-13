import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
import { hashPassword, generateToken } from '../utils/auth.js';
import { validateSignupStepPayload } from '../validation/schemas.js';

const PROFILE_BUCKET = process.env.SUPABASE_PROFILE_BUCKET || 'profile-photos';
const USER_SELECT_FIELDS = 'id, email, first_name, last_name, role, profile_picture_url';

const minimalUserResponse = (user) => ({
  userId: user.id,
  email: user.email,
  firstName: user.first_name || null,
  lastName: user.last_name || null,
  userType: user.role || 'applicant',
  profilePictureUrl: user.profile_picture_url || null
});

const toNullable = (value) => value || null;

const findUserByEmail = async (email) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  return { user: data, error };
};

const ensureProfileBucket = async (bucketName) => {
  const { data: existingBucket, error: getBucketError } = await supabaseAdmin.storage.getBucket(bucketName);

  if (!getBucketError && existingBucket) {
    return { success: true };
  }

  const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  });

  if (createBucketError && !createBucketError.message?.toLowerCase().includes('already exists')) {
    return {
      success: false,
      message: createBucketError.message || `Failed to create storage bucket '${bucketName}'`
    };
  }

  return { success: true };
};

const uploadProfilePhoto = async (authUserId, profilePhoto) => {
  if (!profilePhoto) {
    return { uploadedPhotoUrl: null, uploadedPhotoPath: null };
  }

  const bucketStatus = await ensureProfileBucket(PROFILE_BUCKET);
  if (!bucketStatus.success) {
    return { error: bucketStatus.message };
  }

  const safeFileName = profilePhoto.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${authUserId}/${Date.now()}-${safeFileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PROFILE_BUCKET)
    .upload(filePath, profilePhoto.buffer, {
      contentType: profilePhoto.mimetype,
      upsert: false
    });

  if (uploadError) {
    return { error: uploadError.message || 'Failed to upload profile photo' };
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(filePath);

  return {
    uploadedPhotoPath: filePath,
    uploadedPhotoUrl: publicData?.publicUrl || filePath
  };
};

const deleteAuthUserSafely = async (userId) => {
  await supabaseAdmin.auth.admin.deleteUser(userId);
};

const removeUploadedPhotoSafely = async (uploadedPhotoPath) => {
  if (!uploadedPhotoPath) return;
  await supabaseAdmin.storage.from(PROFILE_BUCKET).remove([uploadedPhotoPath]);
};

const insertUserWithFallback = async (payload) => {
  const workingPayload = { ...payload };

  while (true) {
    const result = await supabaseAdmin
      .from('users')
      .insert([workingPayload])
      .select();

    if (!result.error) {
      return result;
    }

    const missingColumnMatch = result.error.message?.match(/'([^']+)' column/);
    const missingColumn = missingColumnMatch?.[1];

    if (!missingColumn || !(missingColumn in workingPayload)) {
      return result;
    }

    delete workingPayload[missingColumn];
  }
};

// Validate signup step (server-side validation for each step)
export const validateSignupStep = async (req, res) => {
  try {
    const { step, formData } = req.body;
    const stepNumber = Number(step);
    const payload = formData || {};

    const validation = validateSignupStepPayload(stepNumber, payload);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors
      });
    }

    if (stepNumber === 1 && payload.email) {
      const { user: existingUser, error: existingUserError } = await findUserByEmail(payload.email);

      if (existingUserError) {
        return res.status(400).json({
          success: false,
          message: 'Unable to validate email at the moment'
        });
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: [{ field: 'email', message: 'Email already registered' }]
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Step validation passed'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Sign up
export const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      suffix,
      birthday,
      gender,
      civilStatus,
      citizenship,
      mobileNumber,
      facebook,
      street,
      barangay,
      city,
      province,
      country,
      zipCode,
      userType
    } = req.body;

    const profilePhoto = req.file || null;
    const requestedRole = userType || 'applicant';

    const { user: existingUser, error: existingUserError } = await findUserByEmail(email);

    if (existingUserError) {
      return res.status(400).json({
        success: false,
        message: 'Unable to validate email at the moment'
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    const {
      uploadedPhotoUrl,
      uploadedPhotoPath,
      error: photoUploadError
    } = await uploadProfilePhoto(authData.user.id, profilePhoto);

    if (photoUploadError) {
      await deleteAuthUserSafely(authData.user.id);
      return res.status(400).json({
        success: false,
        message: photoUploadError
      });
    }

    // Create user profile in database
    const insertPayload = {
      id: authData.user.id,
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      middle_name: toNullable(middleName),
      last_name: lastName,
      suffix: toNullable(suffix),
      birthday: toNullable(birthday),
      gender: toNullable(gender),
      civil_status: toNullable(civilStatus),
      citizenship: toNullable(citizenship),
      mobile_number: toNullable(mobileNumber),
      facebook: toNullable(facebook),
      street: toNullable(street),
      barangay: toNullable(barangay),
      city: toNullable(city),
      province: toNullable(province),
      country: toNullable(country),
      zip_code: toNullable(zipCode),
      profile_picture_url: uploadedPhotoUrl,
      role: requestedRole,
      created_at: new Date()
    };

    const { data: userData, error: dbError } = await insertUserWithFallback(insertPayload);

    if (dbError) {
      await removeUploadedPhotoSafely(uploadedPhotoPath);

      // Rollback: Delete auth user if profile creation fails
      await deleteAuthUserSafely(authData.user.id);
      return res.status(400).json({
        success: false,
        message: dbError.message || 'Failed to create user profile'
      });
    }

    // Generate JWT token
    const insertedUser = userData?.[0] || {
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: requestedRole,
      profile_picture_url: uploadedPhotoUrl
    };
    const resolvedUserType = insertedUser.role || requestedRole;
    const token = generateToken(authData.user.id, email, resolvedUserType);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        ...minimalUserResponse(insertedUser),
        token
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get user details
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .select(USER_SELECT_FIELDS)
      .eq('id', authData.user.id)
      .single();

    if (dbError || !userData) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Generate JWT token
    const resolvedUserType = userData.role || 'applicant';
    const token = generateToken(authData.user.id, email, resolvedUserType);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        ...minimalUserResponse(userData),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .select(USER_SELECT_FIELDS)
      .eq('id', userId)
      .single();

    if (dbError || !userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: minimalUserResponse(userData)
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.CORS_ORIGIN || 'http://localhost:5173'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent if the email exists'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
