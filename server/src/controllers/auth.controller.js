import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { generateToken } from '../services/token.service.js';
import AppError from '../utils/appError.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, provider = 'local' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const userData = {
      name,
      email,
      provider,
    };

    if (provider === 'local') {
      userData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.cookie('token', token, cookieOptions);
    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.provider !== 'local' || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user);

    res.cookie('token', token, cookieOptions);
    return res.status(200).json({ user, token });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    return next(error);
  }
};
