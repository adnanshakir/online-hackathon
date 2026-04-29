import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import AppError from '../utils/appError.js';

export const addUpdate = async (req, res, next) => {
  try {
    const exists = await Incident.exists({ _id: req.params.id });

    if (!exists) {
      throw new AppError('Incident not found', 404);
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
    const updates = await Update.find({ incident: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    return res.status(200).json(updates);
  } catch (error) {
    return next(error);
  }
};
