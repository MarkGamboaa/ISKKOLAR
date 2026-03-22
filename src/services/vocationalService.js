import api from './api';
import { getMyTertiaryApplications } from './tertiaryService';

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

export const validateVocationalStep = async (step, payload, files = {}) => {
  try {
    const formData = new FormData();
    appendPayload(formData, payload);

    if (step === 1 || step === 3) {
      appendFiles(formData, files);
    }

    const response = await api.post(`/scholarships/vocational/validate-step?step=${step}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Step validation failed.');
  }
};

export const submitVocationalApplication = async (payload, files) => {
  try {
    const formData = new FormData();
    appendPayload(formData, payload);
    appendFiles(formData, files);

    const response = await api.post('/scholarships/vocational/apply', formData, {
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
    throw normalizeApiError(error, 'Failed to submit vocational scholarship application.');
  }
};

export const getMyVocationalApplications = async () => {
  try {
    const response = await api.get('/scholarships/vocational/my-applications');
    return response.data?.data || [];
  } catch (error) {
    throw normalizeApiError(error, 'Failed to load vocational applications.');
  }
};

export const hasOngoingScholarshipApplication = async () => {
  const [tertiaryResult, vocationalResult] = await Promise.allSettled([
    getMyTertiaryApplications(),
    getMyVocationalApplications(),
  ]);

  const tertiaryApps = tertiaryResult.status === 'fulfilled' ? tertiaryResult.value : [];
  const vocationalApps = vocationalResult.status === 'fulfilled' ? vocationalResult.value : [];
  const allApplications = [...tertiaryApps, ...vocationalApps];

  const ongoing = allApplications.find((app) =>
    ['pending', 'under_review'].includes(String(app?.status || '').toLowerCase())
  );

  return {
    hasOngoing: Boolean(ongoing),
    ongoingApplication: ongoing || null,
  };
};
