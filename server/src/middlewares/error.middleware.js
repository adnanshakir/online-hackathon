import process from 'node:process';
import { ZodError } from 'zod';
import AppError from '../utils/appError.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

const mapZodErrors = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));

export default function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  logger.error(error);
  console.error('SERVER ERROR:', error);
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: 'Invalid ID format',
    });
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
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
}
