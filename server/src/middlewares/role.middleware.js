import AppError from '../utils/appError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError('Forbidden', 403);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export default authorize;
