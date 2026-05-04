import { Router } from 'express';
import {
  getIncidentSummary,
  getIncidentRootCause,
  suggestIncidentCauses,
  polishIncidentDetails,
} from '../controllers/ai.controller.js';
import {
  authenticate,
  requireVerification,
} from '../middlewares/auth.middleware.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Protect all AI routes
router.use(authenticate);
router.use(requireVerification);
router.use(apiLimiter);

/**
 * @route GET /api/ai/incidents/:id/summary
 * @desc Get AI-generated summary for an incident
 * @access Private
 */
router.get('/incidents/:id/summary', getIncidentSummary);

/**
 * @route GET /api/ai/incidents/:id/root-cause
 * @desc Get AI-generated root cause for an incident
 * @access Private
 */
router.get('/incidents/:id/root-cause', getIncidentRootCause);

router.post('/suggest-causes', suggestIncidentCauses);

/**
 * @route POST /api/ai/polish
 * @desc Professionalize incident title and description
 * @access Private
 */
router.post('/polish', polishIncidentDetails);

export default router;
