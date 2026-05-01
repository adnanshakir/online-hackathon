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

    const user = await User.findById(payload.id);

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

export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!req.user.isVerified) {
    return next(
      new AppError(
        'Email verification required for full access. Please check your inbox.',
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
