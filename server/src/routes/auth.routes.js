import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  googleCallback,
} from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();

/*
    @route   POST /api/auth/register
    @desc    Register a new user
    @access  Public
*/
router.post('/register', validate(registerSchema), register);

/*
    @route   POST /api/auth/login
    @desc    Authenticate user and issue tokens (via cookies)
    @access  Public
*/
router.post('/login', validate(loginSchema), login);

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

export default router;
