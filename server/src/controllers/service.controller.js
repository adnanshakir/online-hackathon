import { Service } from '../models/service.model.js';
import { Incident } from '../models/incident.model.js';
import AppError from '../utils/appError.js';

export const createService = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      environment,
      status,
    } = req.body;

    let service;
    try {
      service = await Service.create({
        name,
        description,
        type,
        environment,
        status,
        workspace: req.user.workspace,
        createdBy: req.user._id,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('Service already exists in this workspace', 400);
      }
      throw err;
    }

    await service.populate('createdBy', 'name email');

    return res.status(201).json(service);
  } catch (error) {
    return next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = { workspace: req.user.workspace };

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: services,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    }).populate('createdBy', 'name email');

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const allowed = [
      'name',
      'description',
      'type',
      'environment',
      'status',
    ];

    const hasValidField = Object.keys(req.body).some((key) =>
      allowed.includes(key)
    );

    if (!hasValidField) {
      throw new AppError('No valid fields provided for update', 400);
    }

    const service = await Service.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    try {
      await service.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('Service already exists in this workspace', 400);
      }
      throw err;
    }

    await service.populate('createdBy', 'name email');

    return res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};

// FIX (2026-05-02): Toggle service health status from the Services page.
// Used by the dashboard "operational/degraded/down/maintenance" pill — also
// surfaces on the public status page. Workspace-scoped so cross-tenant
// writes are blocked.
export const updateServiceStatus = async (req, res, next) => {
  try {
    // ✅ role check
    if (!['admin', 'owner'].includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }

    const { status } = req.body;

    // ✅ required check
    if (!status) {
      throw new AppError('Status is required', 400);
    }

    // ✅ allowed validation
    const allowed = ['operational', 'degraded', 'down', 'maintenance'];

    if (!allowed.includes(status)) {
      throw new AppError(
        `Invalid status. Allowed: ${allowed.join(', ')}`,
        400
      );
    }

    // ✅ efficient update (best approach)
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, workspace: req.user.workspace },
      { healthStatus: status },
      { new: true }
    );

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    await service.populate('createdBy', 'name email');

    return res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      workspace: req.user.workspace,
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    const inUse = await Incident.exists({
      service: service._id,
      workspace: req.user.workspace,
    });

    if (inUse) {
      throw new AppError(
        'Service is used in incidents and cannot be deleted',
        400
      );
    }

    await service.deleteOne();

    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
