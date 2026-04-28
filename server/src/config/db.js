import mongoose from 'mongoose';
import { config } from './config.js';

const connectDB = async () => {
  const mongoUri = config.MONGO_URI;

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    return false;
  }
};

export default connectDB;
