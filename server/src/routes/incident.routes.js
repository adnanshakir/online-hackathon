import { Router } from 'express';
import validate from '../middlewares/validate.middleware.js';
import { authenticate, requireVerification } from '../middlewares/auth.middleware.js';
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
router.use(apiLimiter);

router.post(
  '/',
  requireVerification,
  validate(createIncidentSchema),
  createIncident
);
/** @route POST /api/incidents
 * @desc Create a new incident
 * @access Private
 */
router.post('/', validate(createIncidentSchema), createIncident);

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
router.patch(
  '/:id/status',
  requireVerification,
  validate(updateStatusSchema),
  updateIncidentStatus
);
router.patch(
  '/:id/assign',
  requireVerification,
  validate(assignUsersSchema),
  assignUsers
);

// Nested timeline routes under incidents/:id/updates
router.use('/:id/updates', updateRoutes);

export default router;
