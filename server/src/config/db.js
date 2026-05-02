import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from '../utils/logger.js';

const connectDB = async () => {
  const mongoUri = config.MONGO_URI;

  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
    return true;
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    return false;
  }
};

export default connectDB;
