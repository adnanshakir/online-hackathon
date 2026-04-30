import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import { User } from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const createIncident = async (req, res, next) => {
  try {
    if (!req.user.workspace) {
      throw new AppError('No workspace assigned', 400);
    }

    const incident = await Incident.create({
      ...req.body,
      createdBy: req.user._id,
      workspace: req.user.workspace,
    });

    await incident.populate('createdBy', 'name email');
    return res.status(201).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    if (!req.user.workspace) {
      throw new AppError('No workspace assigned', 400);
    }

    const {
      status,
      severity,
      search,
      page = 1,
      limit = 10,
      assigned,
    } = req.query;

    const query = {
      workspace: req.user.workspace,
    };

    // filters
    if (status) query.status = status;
    if (severity) query.severity = severity;

    // 🔥 my incidents filter
    if (assigned === 'me') {
      query.assignedTo = req.user._id;
    }

    // search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [incidents, total] = await Promise.all([
      Incident.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Incident.countDocuments(query),
    ]);

    return res.status(200).json({
      data: incidents,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateIncidentStatus = async (req, res, next) => {
  try {
    if (!req.user.workspace) {
      throw new AppError('No workspace assigned', 400);
    }

    const { status } = req.body;

    // Fetch incident first to check access
    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    if (incident.status === status) {
      return res.status(200).json(incident);
    }

    // Check access: admin or assigned to incident
    const isAssigned = incident.assignedTo.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!['admin', 'owner'].includes(req.user.role) && !isAssigned) {
      throw new AppError('Forbidden', 403);
    }

    if (incident.status === status) {
      return res.status(200).json(incident);
    }

    // Update status
    incident.status = status;
    await incident.save();

    // Record status transitions in the incident timeline.
    await Update.create({
      incident: incident._id,
      workspace: req.user.workspace,
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
    // Check access: admin only
    if (!['admin', 'owner'].includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }

    if (!req.user.workspace) {
      throw new AppError('No workspace assigned', 400);
    }

    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    if (Array.isArray(req.body.assignedTo)) {
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

    // Log assignment update
    await Update.create({
      incident: incident._id,
      workspace: req.user.workspace,
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
    if (!req.user.workspace) {
      throw new AppError('No workspace assigned', 400);
    }

    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    })
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
