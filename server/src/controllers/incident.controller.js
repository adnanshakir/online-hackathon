import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import { User } from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const createIncident = async (req, res, next) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(incidents);
  } catch (error) {
    return next(error);
  }
};

export const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    // Record status transitions in the incident timeline.
    await Update.create({
      incident: incident._id,
      message: `Status changed to ${status}`,
      type: 'status_change',
      createdBy: req.user._id,
    });

    return res.status(200).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const assignUsers = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    if (req.body.assignedTo) {
      // Validate that all user IDs exist in the database
      const validUsersCount = await User.countDocuments({
        _id: { $in: req.body.assignedTo },
      });

      if (validUsersCount !== req.body.assignedTo.length) {
        throw new AppError(
          'One or more User IDs are invalid or do not exist',
          400
        );
      }

      incident.assignedTo = req.body.assignedTo;
    }

    await incident.save();

    // optional: log assignment update
    await Update.create({
      incident: incident._id,
      message: 'Users assigned/updated',
      type: 'log',
      createdBy: req.user._id,
    });

    await incident.populate('createdBy', 'name email');
    await incident.populate('assignedTo', 'name email');

    return res.status(200).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    return res.status(200).json(incident);
  } catch (error) {
    return next(error);
  }
};
