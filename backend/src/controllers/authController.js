import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
import { hashPassword, generateToken } from '../utils/auth.js';
import {
  validateProfilePhotoFile,
  validateSignupStepPayload
} from '../validation/authValidation.js';

const PROFILE_BUCKET = process.env.SUPABASE_PROFILE_BUCKET || 'profile-photos';
const USER_SELECT_FIELDS = 'id, email, first_name, last_name, role, profile_picture_url, is_active';
const EMAIL_VERIFY_REDIRECT_URL = process.env.EMAIL_VERIFY_REDIRECT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173';

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

const sendSignupVerificationEmail = async (email) =>
  supabaseClient.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: EMAIL_VERIFY_REDIRECT_URL }
  });

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
    const profilePhotoError = validateProfilePhotoFile(profilePhoto);

    if (profilePhotoError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [{ field: 'profilePhoto', message: profilePhotoError }]
      });
    }

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

      await deleteAuthUserSafely(authData.user.id);
      return res.status(400).json({
        success: false,
        message: dbError.message || 'Failed to create user profile'
      });
    }

    const insertedUser = userData?.[0] || {
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: requestedRole,
      profile_picture_url: uploadedPhotoUrl
    };

    const { error: verificationError } = await sendSignupVerificationEmail(email);

    return res.status(201).json({
      success: true,
      message: verificationError
        ? 'Account created. Verification email could not be sent right now.'
        : 'Account created. Please verify your email before logging in.',
      data: {
        ...minimalUserResponse(insertedUser),
        pendingVerification: true
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

    if (!authData?.user?.email_confirmed_at) {
      await supabaseClient.auth.signOut();
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email before logging in.'
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

    const resolvedUserType = userData.role || 'applicant';

    if (['applicant', 'scholar'].includes(resolvedUserType) && !userData.is_active) {
      await supabaseClient.auth.signOut();
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_INACTIVE',
        message: 'Your account is inactive. Please contact support.'
      });
    }

    // Generate JWT token
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

// Get applicant details with application and scholarship information
export const getApplicantDetails = async (req, res) => {
  try {
    const { applicantId } = req.params;

    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', applicantId)
      .eq('role', 'applicant')
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }

    // Get application(s) for this user
    const { data: applications, error: applicationsError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('user_id', applicantId)
      .order('submitted_at', { ascending: false });

    if (applicationsError) {
      console.error('Applications error:', applicationsError);
      return res.status(500).json({
        success: false,
        message: applicationsError.message || 'Failed to fetch applications'
      });
    }

    // Get scholarship info for each application
    let applicationsWithDetails = [];
    if (applications && applications.length > 0) {
      for (const app of applications) {
        let scholarship = null;
        let reviewedBy = null;
        let familyMembers = [];
        let documents = [];
        let typeSpecificData = null;

        // Get scholarship details
        if (app.scholarship_id) {
          const { data: scholarshipData, error: scholarshipError } = await supabaseAdmin
            .from('scholarships')
            .select('*')
            .eq('id', app.scholarship_id)
            .single();

          if (!scholarshipError && scholarshipData) {
            scholarship = {
              id: scholarshipData.id,
              title: scholarshipData.title,
              description: scholarshipData.description,
              amount: scholarshipData.amount,
              requirementsJson: scholarshipData.requirements_json,
              applicationDeadline: scholarshipData.application_deadline,
              status: scholarshipData.status
            };
          }
        }

        // Get reviewer details if exists
        if (app.reviewed_by) {
          const { data: reviewerData, error: reviewerError } = await supabaseAdmin
            .from('users')
            .select('id, first_name, last_name, email')
            .eq('id', app.reviewed_by)
            .single();

          if (!reviewerError && reviewerData) {
            reviewedBy = {
              id: reviewerData.id,
              firstName: reviewerData.first_name,
              lastName: reviewerData.last_name,
              email: reviewerData.email
            };
          }
        }

        // Get family members for this application
        const { data: familyData, error: familyError } = await supabaseAdmin
          .from('family_members')
          .select('*')
          .eq('application_id', app.id);

        if (!familyError && familyData && familyData.length > 0) {
          familyMembers = familyData.map(member => ({
            id: member.id,
            fullName: member.full_name,
            relationship: member.relationship,
            age: member.age,
            occupation: member.occupation,
            monthlyIncome: member.monthly_income,
            status: member.status
          }));
        }

        // Get application documents for this application
        const { data: docData, error: docError } = await supabaseAdmin
          .from('application_documents')
          .select('*')
          .eq('application_id', app.id);

        if (!docError && docData && docData.length > 0) {
          documents = await Promise.all(docData.map(async (doc) => {
            const { data: signedData } = await supabaseAdmin.storage.from('scholarship-documents').createSignedUrl(doc.file_path, 60 * 60, { download: false });
            return {
              id: doc.id,
              documentType: doc.document_type,
              fileName: doc.file_name,
              filePath: doc.file_path,
              fileUrl: signedData?.signedUrl || doc.file_path,
              fileSize: doc.file_size,
              mimeType: doc.mime_type,
              uploadedAt: doc.uploaded_at,
              isRequired: doc.is_required
            };
          }));
        }

        // Get type-specific data based on application_type
        if (app.application_type) {
          if (app.application_type.toLowerCase() === 'tertiary') {
            const { data: tertiaryDetails } = await supabaseAdmin
              .from('tertiary_application_details')
              .select('*')
              .eq('application_id', app.id)
              .single();

            const { data: tertiaryEducation } = await supabaseAdmin
              .from('tertiary_education')
              .select('*')
              .eq('application_id', app.id);

            typeSpecificData = {
              type: 'tertiary',
              details: tertiaryDetails ? {
                incomingFreshman: tertiaryDetails.incoming_freshman,
                schoolName: tertiaryDetails.school_name,
                course: tertiaryDetails.course,
                yearLevel: tertiaryDetails.year_level,
                gpa: tertiaryDetails.gpa,
                tuitionFee: tertiaryDetails.tuition_fee,
                miscellaneousFee: tertiaryDetails.miscellaneous_fee,
                detailsJson: tertiaryDetails.details_json
              } : null,
              education: tertiaryEducation && tertiaryEducation.length > 0 ? tertiaryEducation.map(edu => ({
                id: edu.id,
                schoolName: edu.school_name,
                level: edu.level,
                yearCompleted: edu.year_completed,
                generalAverage: edu.general_average,
                certificateFileUrl: edu.certificate_file_url
              })) : []
            };
          } else if (app.application_type.toLowerCase() === 'vocational') {
            const { data: vocationalDetails } = await supabaseAdmin
              .from('vocational_application_details')
              .select('*')
              .eq('application_id', app.id)
              .single();

            const { data: vocationalEducation } = await supabaseAdmin
              .from('vocational_education')
              .select('*')
              .eq('application_id', app.id);

            typeSpecificData = {
              type: 'vocational',
              details: vocationalDetails ? {
                programName: vocationalDetails.program_name,
                trainingCenter: vocationalDetails.training_center,
                duration: vocationalDetails.duration,
                startDate: vocationalDetails.start_date,
                endDate: vocationalDetails.end_date,
                trainingCost: vocationalDetails.training_cost,
                detailsJson: vocationalDetails.details_json
              } : null,
              education: vocationalEducation && vocationalEducation.length > 0 ? vocationalEducation.map(edu => ({
                id: edu.id,
                courseName: edu.course_name,
                provider: edu.provider,
                completionDate: edu.completion_date,
                certificateFileUrl: edu.certificate_file_url
              })) : []
            };
          }
        }

        applicationsWithDetails.push({
          id: app.id,
          applicationType: app.application_type,
          status: app.status,
          submittedAt: app.submitted_at,
          reviewedAt: app.reviewed_at,
          reviewedBy: reviewedBy,
          notes: app.notes,
          familyMembers: familyMembers,
          documents: documents,
          typeSpecificData: typeSpecificData,
          scholarship: scholarship,
          createdAt: app.created_at
        });
      }
    }

    const formattedUser = {
      id: user.id,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      suffix: user.suffix,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      civilStatus: user.civil_status,
      citizenship: user.citizenship,
      mobileNumber: user.mobile_number,
      facebook: user.facebook,
      street: user.street,
      barangay: user.barangay,
      city: user.city,
      province: user.province,
      country: user.country,
      zipCode: user.zip_code,
      profilePictureUrl: user.profile_picture_url,
      createdAt: user.created_at
    };

    return res.status(200).json({
      success: true,
      data: {
        user: formattedUser,
        applications: applicationsWithDetails
      }
    });
  } catch (error) {
    console.error('Get applicant details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all applicants with their application status
export const getApplicants = async (req, res) => {
  try {
    // Get all users with role 'applicant'
    const { data: applicants, error: applicantsError } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, profile_picture_url, created_at')
      .eq('role', 'applicant')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (applicantsError) {
      return res.status(500).json({
        success: false,
        message: applicantsError.message || 'Failed to fetch applicants'
      });
    }

    if (!applicants || applicants.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Get IDs of applicants that have applications
    const { data: applications, error: applicationsError } = await supabaseAdmin
      .from('applications')
      .select('user_id, status, submitted_at')
      .in('user_id', applicants.map(a => a.id));

    if (applicationsError) {
      return res.status(500).json({
        success: false,
        message: applicationsError.message || 'Failed to fetch applications'
      });
    }

    // Create a map of user_id to application info (status and submission date)
    const applicantApplicationMap = {};
    if (applications && applications.length > 0) {
      applications.forEach(app => {
        applicantApplicationMap[app.user_id] = {
          status: app.status,
          submittedAt: app.submitted_at
        };
      });
    }

    // Format applicants with their status and application date
    const formattedApplicants = applicants.map(applicant => ({
      id: applicant.id,
      firstName: applicant.first_name,
      lastName: applicant.last_name,
      email: applicant.email,
      profilePictureUrl: applicant.profile_picture_url,
      createdAt: applicant.created_at,
      // Use the actual application status from the database, or null if none exists
      applicationStatus: applicantApplicationMap[applicant.id]?.status || null,
      // Application submission date (only populated if they have an application)
      applicationSubmittedAt: applicantApplicationMap[applicant.id]?.submittedAt || null
    }));

    return res.status(200).json({
      success: true,
      data: formattedApplicants
    });
  } catch (error) {
    console.error('Get applicants error:', error);
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
