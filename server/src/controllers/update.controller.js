import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import AppError from '../utils/appError.js';

export const addUpdate = async (req, res, next) => {
  try {
    // Fetch incident first to check access
    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    // Any workspace member can contribute to the incident log

    const update = await Update.create({
      incident: req.params.id,
      workspace: req.user.workspace,
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
    // Any workspace member can view the timeline
    const updates = await Update.find({
      incident: req.params.id,
      workspace: req.user.workspace,
    })
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: 1 });

    return res.status(200).json(updates);
  } catch (error) {
    return next(error);
  }
};

export const deleteUpdate = async (req, res, next) => {
  try {
    const update = await Update.findOne({
      _id: req.params.updateId,
      incident: req.params.id,
      workspace: req.user.workspace,
    });

    if (!update) {
      throw new AppError('Update not found', 404);
    }

    // Allow owner/admin or the author of the update
    const isAuthor = update.createdBy.toString() === req.user._id.toString();

    if (!['admin', 'owner'].includes(req.user.role) && !isAuthor) {
      throw new AppError('Forbidden', 403);
    }

    await update.deleteOne();

    return res.status(200).json({ message: 'Update deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
