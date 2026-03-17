import express from 'express';
import {
  validateTertiaryStep,
  submitTertiaryApplication,
  getMyTertiaryApplications,
  getTertiaryApplicationById,
} from '../controllers/tertiaryController.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadTertiaryDocs } from '../middleware/upload.js';
import {
  normalizeTertiaryRequestBody,
  validateTertiaryStepPayload,
  validateTertiaryStepFiles,
  validateTertiarySubmission,
} from '../middleware/validation.js';

const router = express.Router();

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

export default router;
