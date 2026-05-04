import { User } from '../models/user.model.js';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    let payload;
    try {
      payload = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Access token expired', 401);
      }
      throw new AppError('Invalid access token', 401);
    }

    const user = await User.findById(payload.id).populate('workspace');

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

import crypto from 'crypto';
import { sendVerificationEmail } from '../services/mail.service.js';

export const requireVerification = async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!req.user.isVerified) {
    // 1. Check if we should send a new verification email
    const now = new Date();
    const lastSent = req.user.lastVerificationSentAt;
    const cooldownPeriod = 10 * 1000; // 10 second cooldown for testing (was 5m)

    if (!lastSent || now - lastSent > cooldownPeriod) {
      try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
          .createHash('sha256')
          .update(verificationToken)
          .digest('hex');

        // Use findOneAndUpdate with a condition to prevent race conditions
        // only update if lastVerificationSentAt matches what we saw or is still null
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: req.user._id,
            $or: [
              { lastVerificationSentAt: lastSent },
              { lastVerificationSentAt: null },
            ],
          },
          {
            $set: {
              verificationToken: hashedToken,
              verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
              lastVerificationSentAt: new Date(),
            },
          },
          { new: true }
        );

        // If updatedUser is null, it means another request already updated it
        if (updatedUser) {
          sendVerificationEmail(
            req.user.email,
            req.user.name,
            verificationToken,
            req.user._id
          );

          return next(
            new AppError(
              "We've just sent a fresh verification link to your inbox. Please verify your account to start using OpsWatch.",
              403
            )
          );
        }
      } catch (err) {
        console.error(
          '[auth.middleware] Auto-verification trigger failed:',
          err
        );
      }
    }

    return next(
      new AppError(
        "Please verify your account to access this feature. We've already sent a link to your email.",
        403
      )
    );
  }

  next();
};

export const requireWorkspace = (req, res, next) => {
  if (!req.user.workspace) {
    return next(
      new AppError(
        'You must create or join a workspace to access this feature.',
        403
      )
    );
  }
  next();
};

export default authenticate;
