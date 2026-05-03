import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import { User } from '../models/user.model.js';
import { Service } from '../models/service.model.js';
import AppError from '../utils/appError.js';

export const createIncident = async (req, res, next) => {
  try {
    const { title, description, severity, service: serviceId } = req.body;

    // Validate service belongs to workspace
    const service = await Service.findOne({
      _id: serviceId,
      workspace: req.user.workspace,
    });

    if (!service) {
      throw new AppError('Invalid service selected for this workspace', 400);
    }

    const incident = await Incident.create({
      title,
      description,
      severity,
      service: serviceId,
      createdBy: req.user._id,
      workspace: req.user.workspace,
    });

    await incident.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'service', select: 'name type environment' },
    ]);
    return res.status(201).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
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
        .populate('service', 'name type environment')
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
    const { status } = req.body;

    // Fetch incident first to check access
    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
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

    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    if (Array.isArray(req.body.assignedTo)) {
      // Filter out invalid IDs (like mock UI IDs) and find real users
      const potentialIds = req.body.assignedTo.filter((id) =>
        /^[0-9a-fA-F]{24}$/.test(id)
      );

      const validUsers = await User.find({
        _id: { $in: potentialIds },
      });

      // Assign only the IDs that actually exist in our DB
      incident.assignedTo = validUsers.map((u) => u._id);
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
    await incident.populate('service', 'name type environment');

    return res.status(200).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('service', 'name type environment');

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    return res.status(200).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const updateIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    // Check access: owner/admin or assigned
    const isAssigned = incident.assignedTo.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!['admin', 'owner'].includes(req.user.role) && !isAssigned) {
      throw new AppError('Forbidden', 403);
    }

    // Validate new service if provided
    if (req.body.service) {
      const service = await Service.findOne({
        _id: req.body.service,
        workspace: req.user.workspace,
      });

      if (!service) {
        throw new AppError('Invalid service selected for this workspace', 400);
      }
    }

    const allowed = ['title', 'description', 'severity', 'service'];

    const hasValidField = Object.keys(req.body).some((key) =>
      allowed.includes(key)
    );

    if (!hasValidField) {
      throw new AppError('No valid fields provided for update', 400);
    }

    let updated = false;

    allowed.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== incident[field]
      ) {
        incident[field] = req.body[field];
        updated = true;
      }
    });

    if (!updated) {
      throw new AppError('No changes applied', 400);
    }

    await incident.save();

    // Log update only if something changed
    await Update.create({
      incident: incident._id,
      workspace: req.user.workspace,
      message: 'Incident updated',
      type: 'log',
      createdBy: req.user._id,
    });

    await incident.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'service', select: 'name type environment' },
    ]);

    return res.status(200).json(incident);
  } catch (error) {
    return next(error);
  }
};

export const deleteIncident = async (req, res, next) => {
  try {
    // Only owner/admin may delete
    if (!['admin', 'owner'].includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }

    const incident = await Incident.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    await Promise.all([
      Update.deleteMany({
        incident: incident._id,
        workspace: req.user.workspace,
      }),
      incident.deleteOne(),
    ]);

    return res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
