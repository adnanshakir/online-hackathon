import { Incident } from '../models/incident.model.js';

// 🔴 Active incidents (not resolved)
export const getStatus = async (req, res, next) => {
  try {
    const incidents = await Incident.find({
      status: { $ne: 'resolved' },
    })
      .select('title severity status service createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    return next(error);
  }
};

// 🟢 Resolved incidents (history)
export const getStatusHistory = async (req, res, next) => {
  try {
    const incidents = await Incident.find({
      status: 'resolved',
    })
      .select('title severity status service createdAt updatedAt')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    return next(error);
  }
};
