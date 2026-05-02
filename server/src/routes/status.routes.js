import { Router } from 'express';
import {
  getStatus,
  getStatusHistory,
} from '../controllers/status.controller.js';

const router = Router();

/**
 * @route GET /api/status
 * @desc Get status of active incidents
 * @access Public
 */
router.get('/', getStatus);

/**
 * @route GET /api/status/history
 * @desc Get status history of resolved incidents
 * @access Public
 */
router.get('/history', getStatusHistory);

export default router;
