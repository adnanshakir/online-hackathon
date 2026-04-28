import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
