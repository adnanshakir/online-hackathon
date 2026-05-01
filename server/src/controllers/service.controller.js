import { Service } from '../models/service.model.js';
import AppError from '../utils/appError.js';

export const createService = async (req, res, next) => {
  try {
    const { name, type, techStack } = req.body;

    // Sanitize name for regex to prevent injection
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check if service with same name exists in this workspace
    const existing = await Service.findOne({
      workspace: req.user.workspace,
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
    });

    if (existing) {
      throw new AppError('Service with this name already exists in your workspace', 400);
    }

    const service = await Service.create({
      name,
      type,
      techStack,
      workspace: req.user.workspace,
      createdBy: req.user._id,
    });

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
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};
