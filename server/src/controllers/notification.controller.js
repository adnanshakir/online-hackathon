import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { eventBus } from '../utils/eventBus.js';
import AppError from '../utils/appError.js';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Event Constants
export const NOTIFICATION_EVENTS = {
  CREATED: 'notification:created',
  ERROR: 'notification:error',
};

/**
 * SSE Stream for real-time notifications.
 */
export const streamNotifications = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*'); // For cross-origin if needed
  res.flushHeaders();

  const userId = req.user._id.toString();
  const workspaceId =
    req.user.workspace?._id?.toString() || req.user.workspace?.toString();

  // Retry hint: Tell the client to reconnect after 10 seconds if connection drops
  res.write('retry: 10000\n\n');

  const onNotification = (notification) => {
    try {
      const targetUser = notification.recipient.toString();
      const targetWorkspace = notification.workspace.toString();

      if (targetUser === userId && targetWorkspace === workspaceId) {
        res.write(`event: notification\n`);
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
      }
    } catch (err) {
      logger.error('[SSE ERROR]', err);
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: 'Error processing notification' })}\n\n`
      );
    }
  };

  eventBus.on(NOTIFICATION_EVENTS.CREATED, onNotification);

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    eventBus.off(NOTIFICATION_EVENTS.CREATED, onNotification);
    res.end();
  });

  // Handle potential server-side errors
  req.on('error', (err) => {
    logger.error('[SSE CONNECTION ERROR]', err);
    clearInterval(heartbeat);
    eventBus.off(NOTIFICATION_EVENTS.CREATED, onNotification);
  });
};

/**
 * Fetch all notifications for the current user.
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      recipient: req.user._id,
      workspace: req.user.workspace,
    };

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(query),
    ]);

    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
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

/**
 * Mark a specific notification as read.
 */
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    return res.status(200).json(notification);
  } catch (error) {
    return next(error);
  }
};

/**
 * Mark all notifications in the workspace as read for the user.
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        workspace: req.user.workspace,
        isRead: false,
      },
      { isRead: true }
    );

    return res
      .status(200)
      .json({ message: 'All notifications marked as read' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Internal validation helper
 */
const validateNotificationPayload = (payload) => {
  const { actorId, workspaceId, type, title, message } = payload;
  if (!actorId || !workspaceId || !type || !title || !message) {
    throw new Error('Missing required notification fields');
  }
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new Error('Invalid workspace ID');
  }
};

/**
 * Helper function to create and broadcast notifications to a SINGLE user.
 */
export const notifyUser = async (payload) => {
  try {
    validateNotificationPayload(payload);
    const { recipientId, actorId, workspaceId, type, title, message, link } =
      payload;

    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      throw new Error('Invalid or missing recipient ID');
    }

    const notification = await Notification.create({
      recipient: recipientId,
      actor: actorId,
      workspace: workspaceId,
      type,
      title,
      message,
      link,
    });

    eventBus.emit(NOTIFICATION_EVENTS.CREATED, notification);
  } catch (error) {
    logger.error('[NOTIFY USER ERROR]', error.message);
  }
};

/**
 * Helper function to create and broadcast notifications to an ENTIRE workspace.
 */
export const notifyWorkspace = async (payload) => {
  try {
    validateNotificationPayload(payload);
    const { actorId, workspaceId, type, title, message, link } = payload;

    const wsId = workspaceId?._id?.toString() || workspaceId?.toString();
    const actId = actorId?.toString();

    // Find all users in this workspace efficiently
    const members = await User.find({ workspace: wsId }).select('_id').lean();

    // Include everyone (including the actor) for workspace-wide events
    const recipientIds = members.map((m) => m._id.toString());

    if (recipientIds.length === 0) return;

    const notificationsData = recipientIds.map((id) => ({
      recipient: id,
      actor: actId,
      workspace: wsId,
      type,
      title,
      message,
      link,
    }));

    // Batch insert for performance
    const createdNotifications =
      await Notification.insertMany(notificationsData);

    // Emit events after database sync
    createdNotifications.forEach((n) => {
      eventBus.emit(NOTIFICATION_EVENTS.CREATED, n);
    });
  } catch (error) {
    logger.error('[NOTIFY WORKSPACE ERROR]', error.message);
  }
};
