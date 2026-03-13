import express from 'express';
import {
  validateSignupStep,
  signUp,
  login,
  forgotPassword,
  getCurrentUser,
  logout
} from '../controllers/authController.js';
import { validateRequest } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadProfilePhoto } from '../middleware/upload.js';
import {
  signUpValidation,
  loginValidation,
  forgotPasswordValidation
} from '../validation/schemas.js';

const router = express.Router();

// Public routes
router.post('/signup/validate-step', validateSignupStep);
router.post('/signup', uploadProfilePhoto.single('profilePhoto'), validateRequest(signUpValidation), signUp);
router.post('/login', validateRequest(loginValidation), login);
router.post('/forgot-password', validateRequest(forgotPasswordValidation), forgotPassword);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);

export default router;
