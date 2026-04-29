import { Router } from 'express';
import validate from '../middlewares/validate.middleware.js';
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

const router = Router();

router.use(authenticate);

router.post('/', validate(createIncidentSchema), createIncident);
router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.patch('/:id/status', validate(updateStatusSchema), updateIncidentStatus);
router.patch('/:id/assign', validate(assignUsersSchema), assignUsers);

// Nested timeline routes under incidents/:id/updates
router.use('/:id/updates', updateRoutes);

export default router;
