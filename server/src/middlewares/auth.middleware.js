import { User } from '../models/user.model.js';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticate;
