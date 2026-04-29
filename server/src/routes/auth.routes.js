import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
} from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/*
    @route   POST /api/auth/register
    @desc    Register a new user
    @access  Public
*/
router.post('/register', validate(registerSchema), register);

/*
    @route   POST /api/auth/login
    @desc    Authenticate user and return token
    @access  Public
*/
router.post('/login', validate(loginSchema), login);

/*
    @route   POST /api/auth/refresh-token
    @desc    Refresh access token using refresh token
    @access  Public
*/
router.post('/refresh-token', refreshAccessToken);

/*
    @route   POST /api/auth/logout
    @desc    Logout user by clearing token cookies and DB
    @access  Private
*/
router.post('/logout', authenticate, logout);

export default router;
