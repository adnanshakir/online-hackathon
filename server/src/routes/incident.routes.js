import { Router } from 'express';
import validate from '../middlewares/validate.middleware.js';
import { requireWorkspace } from '../middlewares/workspace.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  assignUsersSchema,
  createIncidentSchema,
  updateStatusSchema,
} from '../validators/incident.validator.js';
import {
  assignUsers,
  createIncident,
  getIncidentById,
  getIncidents,
  updateIncidentStatus,
} from '../controllers/incident.controller.js';
import updateRoutes from './update.routes.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireWorkspace);
router.use(apiLimiter);

/** @route POST /api/incidents
 * @desc Create a new incident
 * @access Private
 */
router.post(
  '/',
  // requireVerification,
  validate(createIncidentSchema),
  createIncident
);

/** @route GET /api/incidents
 * @desc Get all incidents
 * @access Private
 */
router.get('/', getIncidents);

/** @route GET /api/incidents/:id
 * @desc Get incident by ID
 * @access Private
 */
router.get('/:id', getIncidentById);

/** @route PATCH /api/incidents/:id/status
 * @desc Update incident status
 * @access Private
 */
router.patch(
  '/:id/status',
  // requireVerification,
  validate(updateStatusSchema),
  updateIncidentStatus
);

/** @route PATCH /api/incidents/:id/assign
 * @desc Assign users to incident
 * @access Private
 */
router.patch(
  '/:id/assign',
  // requireVerification,
  validate(assignUsersSchema),
  assignUsers
);

// Nested timeline routes under incidents/:id/updates
router.use('/:id/updates', updateRoutes);

export default router;
