import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
} from '../controllers/service.controller.js';
import {
  authenticate,
  requireVerification,
  requireWorkspace,
} from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createServiceSchema } from '../validators/service.validator.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(requireWorkspace);
router.use(apiLimiter);

/**
 * @route   GET /api/services
 * @desc    Get all services for the current workspace
 * @access  Private
 */
router.get('/', getServices);

/**
 * @route   GET /api/services/:id
 * @desc    Get a single service by ID
 * @access  Private
 */
router.get('/:id', getServiceById);

/**
 * @route   POST /api/services
 * @desc    Create a new service for the current workspace
 * @access  Private
 */
router.post(
  '/',
  requireVerification,
  validate(createServiceSchema),
  createService
);

export default router;
