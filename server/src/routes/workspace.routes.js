import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createWorkspace,
  joinWorkspace,
  updateUserRole,
} from '../controllers/workspace.controller.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.use(authenticate);
// router.use(requireVerification); // Temporarily disabled
router.use(apiLimiter);

/**
 * @route POST /api/workspace/create
 * @desc Create a new workspace
 * @access Private
 */
router.post('/create', createWorkspace);

/**
 * @route POST /api/workspace/join
 * @desc Join a workspace using invite code
 * @access Private
 */
router.post('/join', joinWorkspace);

/**
 * @route PATCH /api/workspace/role
 * @desc Update user role in workspace (owner only)
 * @access Private
 */
router.patch('/role', updateUserRole);

export default router;
