import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import AppError from '../utils/appError.js';

export const addUpdate = async (req, res, next) => {
  try {
    // Fetch incident first to check access
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    // Check access: admin or assigned to incident
    const isAssigned = incident.assignedTo.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (req.user.role !== 'admin' && !isAssigned) {
      throw new AppError('Forbidden', 403);
    }

    const update = await Update.create({
      incident: req.params.id,
      createdBy: req.user._id,
      message: req.body.message,
      type: req.body.type || 'log',
    });

    return res.status(201).json(update);
  } catch (error) {
    return next(error);
  }
};

export const getUpdates = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const isAssigned = incident.assignedTo.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (req.user.role !== 'admin' && !isAssigned) {
      throw new AppError('Forbidden', 403);
    }

    const updates = await Update.find({ incident: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    return res.status(200).json(updates);
  } catch (error) {
    return next(error);
  }
};
