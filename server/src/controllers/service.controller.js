import { Service } from '../models/service.model.js';
import AppError from '../utils/appError.js';

export const createService = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      techStack,
      environment,
      status,
      repoUrl,
      liveUrl,
    } = req.body;

    let service;
    try {
      service = await Service.create({
        name,
        description,
        type,
        techStack,
        environment,
        status,
        repoUrl,
        liveUrl,
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

// FIX (2026-05-02): Toggle service health status from the Services page.
// Used by the dashboard "operational/degraded/down/maintenance" pill — also
// surfaces on the public status page. Workspace-scoped so cross-tenant
// writes are blocked.
export const updateServiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['operational', 'degraded', 'down', 'maintenance'];
    if (!allowed.includes(status)) {
      throw new AppError(
        `Invalid status. Allowed: ${allowed.join(', ')}`,
        400
      );
    }

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, workspace: req.user.workspace },
      { status },
      { new: true }
    );

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};
