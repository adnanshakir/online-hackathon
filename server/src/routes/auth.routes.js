import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  googleCallback,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  getMe,
} from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../validators/auth.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import passport from 'passport';
import {
  authLimiter,
  strictLimiter,
} from '../middlewares/rateLimit.middleware.js';

const router = Router();

/*
    @route   GET /api/auth/me
    @desc    Get current authenticated user session
    @access  Private
*/

/*
    @route   POST /api/auth/register
    @desc    Register a new user
    @access  Public
*/
router.post('/register', authLimiter, validate(registerSchema), register);

/*
    @route   POST /api/auth/login
    @desc    Authenticate user and issue tokens (via cookies)
    @access  Public
*/
router.post('/login', authLimiter, validate(loginSchema), login);

/*
    @route   GET /api/auth/me
    @desc    Get current logged-in user
    @access  Private
*/
router.get('/me', authenticate, getMe);

/*
    @route   POST /api/auth/refresh-token
    @desc    Issue new access token using refresh token
    @access  Public
*/
router.post('/refresh-token', refreshAccessToken);

/*
    @route   POST /api/auth/logout
    @desc    Clear tokens (cookie + DB) and invalidate session
    @access  Private
*/
router.post('/logout', authenticate, logout);

/*
    @route   GET /api/auth/google
    @desc    Redirect user to Google OAuth consent screen
    @access  Public
*/
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/*
    @route   GET /api/auth/google/callback
    @desc    Handle Google OAuth callback and login/register user
    @access  Public
*/
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  googleCallback
);

/*
    @route   POST /api/auth/forgot-password
    @desc    Send password reset email
    @access  Public
*/
router.post(
  '/forgot-password',
  strictLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

/*
    @route   POST /api/auth/reset-password
    @desc    Reset password using token
    @access  Public
*/
router.post(
  '/reset-password',
  strictLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

/*
    @route   POST /api/auth/verify-email
    @desc    Verify user email using token
    @access  Public
*/
router.post(
  '/verify-email',
  authLimiter,
  validate(verifyEmailSchema),
  verifyEmail
);

/*
    @route   POST /api/auth/resend-verification
    @desc    Resend verification email
    @access  Public
*/
router.post(
  '/resend-verification',
  strictLimiter,
  validate(resendVerificationSchema),
  resendVerificationEmail
);

export default router;
