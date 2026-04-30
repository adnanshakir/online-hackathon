import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireWorkspace } from '../middlewares/workspace.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { addUpdateSchema } from '../validators/update.validator.js';
import { addUpdate, getUpdates } from '../controllers/update.controller.js';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireWorkspace);

/*
    @route   POST /api/incidents/:id/updates
    @desc    Add an update to an incident's timeline
    @access  Private
*/
router.post('/', validate(addUpdateSchema), addUpdate);

/*
    @route   GET /api/incidents/:id/updates
    @desc    Get all updates for an incident's timeline
    @access  Private
*/
router.get('/', getUpdates);

export default router;
