import api from './api';

const appendPayload = (formData, payload) => {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'family_members') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });
};

const appendFiles = (formData, files) => {
  Object.entries(files).forEach(([key, file]) => {
    if (file instanceof File) {
      formData.append(key, file);
    }
  });
};

const normalizeApiError = (error, fallbackMessage) => {
  return (
    error.response?.data || {
      success: false,
      message: error.message || fallbackMessage,
    }
  );
};

export const validateTertiaryStep = async (step, payload, files = {}) => {
  try {
    const formData = new FormData();
    appendPayload(formData, payload);

    if (step === 3) {
      appendFiles(formData, files);
    }

    const response = await api.post(`/scholarships/tertiary/validate-step?step=${step}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Step validation failed.');
  }
};

export const submitTertiaryApplication = async (payload, files) => {
  try {
    const formData = new FormData();
    appendPayload(formData, payload);
    appendFiles(formData, files);

    const response = await api.post('/scholarships/tertiary/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!response.data?.success) {
      throw response.data || {
        success: false,
        message: 'Submission failed. Please try again.',
      };
    }

    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to submit tertiary scholarship application.');
  }
};

export const getMyTertiaryApplications = async () => {
  try {
    const response = await api.get('/scholarships/tertiary/my-applications');
    return response.data?.data || [];
  } catch (error) {
    throw normalizeApiError(error, 'Failed to load tertiary applications.');
  }
};

export const getTertiaryApplicationById = async (id) => {
  try {
    const response = await api.get(`/scholarships/tertiary/${id}`);
    return response.data?.data || null;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to load application details.');
  }
};
