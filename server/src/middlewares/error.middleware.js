import { ZodError } from 'zod';
import AppError from '../utils/appError.js';

const mapZodErrors = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));

export default function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: mapZodErrors(error.issues),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: 'Something went wrong',
  });
}
