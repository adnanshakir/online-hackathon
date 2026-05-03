import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  streamNotifications,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/notifications/stream
 * @desc    Establish an SSE connection for real-time alerts
 * @access  Private
 */
router.get('/stream', streamNotifications);

/**
 * @route   GET /api/notifications
 * @desc    Get paginated notification history
 * @access  Private
 */
router.get('/', getNotifications);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications in workspace as read
 * @access  Private
 */
router.patch('/read-all', markAllAsRead);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.patch('/:id/read', markAsRead);

export default router;
