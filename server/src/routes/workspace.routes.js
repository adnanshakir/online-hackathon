import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireWorkspace } from '../middlewares/workspace.middleware.js';
import {
  createWorkspace,
  joinWorkspace,
  updateUserRole,
  getWorkspace,
  getWorkspaceMembers,
  regenerateInviteCode,
  deleteWorkspace,
  updateWorkspaceContext,
  inviteMember,
} from '../controllers/workspace.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { systemContextSchema } from '../validators/workspace.validator.js';
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
router.patch('/role', requireWorkspace, updateUserRole);

/**
 * @route GET /api/workspace/me
 * @desc Get current user's workspace details
 * @access Private
 */
router.get('/me', requireWorkspace, getWorkspace);

/**
 * @route GET /api/workspace/members
 * @desc Get all members in the current workspace
 * @access Private
 */
router.get('/members', requireWorkspace, getWorkspaceMembers);

/**
 * @route PATCH /api/workspace/invite-code
 * @desc Regenerate workspace invite code (owner only)
 * @access Private
 */
router.patch('/invite-code', requireWorkspace, regenerateInviteCode);

/**
 * @route PATCH /api/workspace/context
 * @desc Update workspace system context (owner/admin only)
 * @access Private
 */
router.patch(
  '/context',
  requireWorkspace,
  validate(systemContextSchema),
  updateWorkspaceContext
);

 /* @route POST /api/workspace/invite
 * @desc Send email invite to a user (owner/admin only)
 * @access Private
 */
router.post('/invite', requireWorkspace, inviteMember);

/**
 * @route DELETE /api/workspace
 * @desc Delete workspace and all related data (owner only)
 * @access Private
 */
router.delete('/', requireWorkspace, deleteWorkspace);

export default router;
