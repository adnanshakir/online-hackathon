import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { config } from '../config/config.js';
import AppError from '../utils/appError.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.NODE_ENV === 'production',
};

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const hashedToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
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
      password,
    };

    const user = await User.create(userData);
    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      '+password +refreshToken'
    );
    if (!user || user.provider !== 'local' || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingToken) {
      throw new AppError('Unauthorized', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingToken, config.REFRESH_TOKEN_SECRET);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || !user.refreshToken) { throw new AppError('Unauthorized', 401); }

    const isTokenValid = await bcrypt.compare(incomingToken, user.refreshToken);
    if (!isTokenValid) {
      throw new AppError('Refresh token is expired or used', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
};
