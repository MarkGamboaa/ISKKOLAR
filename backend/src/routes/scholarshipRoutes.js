import express from 'express';
import {
  validateTertiaryStep,
  submitTertiaryApplication,
  getMyTertiaryApplications,
  getTertiaryApplicationById,
} from '../controllers/tertiaryController.js';
import {
  validateVocationalStep,
  submitVocationalApplication,
  getMyVocationalApplications,
  getVocationalApplicationById,
} from '../controllers/vocationalController.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadTertiaryDocs, uploadVocationalDocs } from '../middleware/upload.js';
import {
  normalizeTertiaryRequestBody,
  validateTertiaryStepPayload,
  validateTertiaryStepFiles,
  validateTertiarySubmission,
  normalizeVocationalRequestBody,
  validateVocationalStepPayload,
  validateVocationalStepFiles,
  validateVocationalSubmission,
} from '../middleware/validation.js';

const router = express.Router();

// ─── TERTIARY ROUTES ──────────────────────────────────────────
router.post(
  '/tertiary/validate-step',
  authMiddleware,
  uploadTertiaryDocs,
  normalizeTertiaryRequestBody,
  validateTertiaryStepPayload,
  validateTertiaryStepFiles,
  validateTertiaryStep
);
router.post(
  '/tertiary/apply',
  authMiddleware,
  uploadTertiaryDocs,
  normalizeTertiaryRequestBody,
  validateTertiarySubmission,
  submitTertiaryApplication
);
router.get('/tertiary/my-applications', authMiddleware, getMyTertiaryApplications);
router.get('/tertiary/:id', authMiddleware, getTertiaryApplicationById);

// ─── VOCATIONAL ROUTES ────────────────────────────────────────
router.post(
  '/vocational/validate-step',
  authMiddleware,
  uploadVocationalDocs,
  normalizeVocationalRequestBody,
  validateVocationalStepPayload,
  validateVocationalStepFiles,
  validateVocationalStep
);
router.post(
  '/vocational/apply',
  authMiddleware,
  uploadVocationalDocs,
  normalizeVocationalRequestBody,
  validateVocationalSubmission,
  submitVocationalApplication
);
router.get('/vocational/my-applications', authMiddleware, getMyVocationalApplications);
router.get('/vocational/:id', authMiddleware, getVocationalApplicationById);

export default router;
