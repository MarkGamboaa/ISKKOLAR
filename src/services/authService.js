import api from "./api";

export const validateSignupStep = async (step, formData) => {
  try {
    const response = await api.post("/auth/signup/validate-step", {
      step,
      formData,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: error.message || "Step validation failed.",
    };
  }
};

// Login
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.success) {
      const { data } = response.data;
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      return {
        token: data.token,
        user: {
          id: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userType: data.userType,
          profilePictureUrl: data.profilePictureUrl,
        },
      };
    }
  } catch (error) {
    if (error.response?.status === 403 && error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
      throw new Error("Please verify your email first. Check your inbox for the verification link.");
    }
    if (error.response?.status === 403 && error.response?.data?.code === "ACCOUNT_INACTIVE") {
      throw new Error("Your account is inactive. Please contact support.");
    }

    throw new Error(
      error.response?.data?.message || "Invalid credentials. Please check your email and password."
    );
  }
};

// Register
export const register = async (userData) => {
  try {
    const formData = new FormData();

    formData.append("email", userData.email || "");
    formData.append("password", userData.password || "");
    formData.append("confirmPassword", userData.confirmPassword || "");
    formData.append("firstName", userData.firstName || "");
    formData.append("middleName", userData.middleName || "");
    formData.append("lastName", userData.lastName || "");
    formData.append("suffix", userData.suffix || "");
    formData.append("birthday", userData.birthday || "");
    formData.append("gender", userData.gender || "");
    formData.append("civilStatus", userData.civilStatus || "");
    formData.append("citizenship", userData.citizenship || "");
    formData.append("mobileNumber", userData.mobileNumber || "");
    formData.append("facebook", userData.facebook || "");
    formData.append("street", userData.street || "");
    formData.append("barangay", userData.barangay || "");
    formData.append("city", userData.city || "");
    formData.append("province", userData.province || "");
    formData.append("country", userData.country || "");
    formData.append("zipCode", userData.zipCode || "");
    formData.append("userType", userData.userType || "applicant");

    if (userData.profilePhoto instanceof File) {
      formData.append("profilePhoto", userData.profilePhoto);
    }

    const response = await api.post("/auth/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return {
        pendingVerification: true,
        message: response.data.message || "Account created. Please verify your email before logging in.",
      };
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create account. Please try again.",
      }
    );
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    if (response.data.success) {
      return {
        message: "A password reset link has been sent to your email.",
      };
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to process password reset request."
    );
  }
};

// Get Current User
export const getCurrentUser = async (token) => {
  try {
    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return {
        id: response.data.data.userId,
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        email: response.data.data.email,
        userType: response.data.data.userType,
        profilePictureUrl: response.data.data.profilePictureUrl,
      };
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data."
    );
  }
};

// Logout
export const logout = async (token) => {
  try {
    const response = await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      // Clear token from localStorage
      localStorage.removeItem("token");
      return response.data;
    }
  } catch (error) {
    // Clear token even if logout request fails
    localStorage.removeItem("token");
    throw new Error(error.response?.data?.message || "Logout failed.");
  }
};
