import AppError from '../utils/appError.js';

export const requireWorkspace = (req, res, next) => {
  if (!req.user.workspace) {
    return next(new AppError('No workspace assigned', 400));
  }

  next();
};
