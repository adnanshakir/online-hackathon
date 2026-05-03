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

export const getPublicStatusPage = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Import Workspace here to avoid circular dependency if any, or just import at top
    const { Workspace } = await import('../models/workspace.model.js');
    const { Service } = await import('../models/service.model.js');

    // Find workspace by status page slug
    const workspace = await Workspace.findOne({
      'statusPageSettings.slug': slug.toLowerCase(),
    }).select('statusPageSettings name');

    if (!workspace) {
      return res
        .status(404)
        .json({ success: false, message: 'Status page not found' });
    }

    // Fetch services for this workspace
    const services = await Service.find({ workspace: workspace._id }).select(
      'name status tier description'
    );

    // Fetch active incidents
    const incidents = await Incident.find({
      workspace: workspace._id,
      status: { $ne: 'resolved' },
    })
      .select('title severity status createdAt message')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        settings: workspace.statusPageSettings,
        workspaceName: workspace.name,
        services,
        activeIncidents: incidents,
      },
    });
  } catch (error) {
    return next(error);
  }
};
