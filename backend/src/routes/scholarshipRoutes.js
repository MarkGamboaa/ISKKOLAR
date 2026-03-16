import express from 'express';
import {
  validateTertiaryStep,
  submitTertiaryApplication,
  getMyTertiaryApplications,
  getTertiaryApplicationById,
} from '../controllers/tertiaryController.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadTertiaryDocs } from '../middleware/upload.js';

const router = express.Router();

router.post('/tertiary/validate-step', authMiddleware, uploadTertiaryDocs, validateTertiaryStep);
router.post('/tertiary/apply', authMiddleware, uploadTertiaryDocs, submitTertiaryApplication);
router.get('/tertiary/my-applications', authMiddleware, getMyTertiaryApplications);
router.get('/tertiary/:id', authMiddleware, getTertiaryApplicationById);

export default router;
