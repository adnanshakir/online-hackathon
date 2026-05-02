import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { config } from '../config/config.js';
import AppError from '../utils/appError.js';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../services/mail.service.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: config.NODE_ENV === 'production',
};

const generateTokens = async (user) => {
  console.log('Generating JWTs for user:', user._id);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  console.log('Hashing refresh token...');
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedToken;

  console.log('Saving user with updated refresh token...');
  await user.save({ validateBeforeSave: false });
  console.log('User saved successfully');

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }).select(
      '+isVerified +lastVerificationSentAt'
    );

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new AppError('Email already in use', 409);
      }

      // Handle unverified existing user - check cooldown
      const now = new Date();
      const lastSent = existingUser.lastVerificationSentAt;
      const cooldownPeriod = 60 * 1000; // 60 seconds

      if (lastSent && now - lastSent < cooldownPeriod) {
        const remainingTime = Math.ceil(
          (cooldownPeriod - (now - lastSent)) / 1000
        );
        throw new AppError(
          `Please wait ${remainingTime} seconds before requesting a new verification email.`,
          429
        );
      }

      // Regenerate and send
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

      existingUser.verificationToken = hashedToken;
      existingUser.verificationExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours
      existingUser.lastVerificationSentAt = new Date();

      await existingUser.save({ validateBeforeSave: false });
      await sendVerificationEmail(email, existingUser.name, verificationToken);

      return res.status(200).json({
        message:
          'Account exists but is not verified. A new verification link has been sent to your email.',
      });
    }

    // New user registration
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const user = await User.create({
      name,
      email,
      password,
      authProviders: ['local'],
      isVerified: false,
      verificationToken: hashedToken,
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      lastVerificationSentAt: new Date(),
    });

    await sendVerificationEmail(email, name, verificationToken);

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
      message:
        'Registration successful! Please check your email to verify your account for full access.',
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select('+password +refreshToken +isVerified')
      .populate('workspace');
    if (!user || !user.authProviders.includes('local') || !user.password) {
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

    console.log('Refreshing token for user ID:', decoded.id);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || !user.refreshToken) {
      console.log('User or refresh token not found in DB');
      throw new AppError('Unauthorized', 401);
    }

    console.log('Comparing tokens...');
    const isTokenValid = await bcrypt.compare(incomingToken, user.refreshToken);
    if (!isTokenValid) {
      console.log('Token comparison failed');
      throw new AppError('Refresh token is expired or used', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }

    console.log('Generating new tokens...');
    const { accessToken, refreshToken } = await generateTokens(user);
    console.log('New tokens generated successfully');

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

export const googleCallback = async (req, res, next) => {
  try {
    const { googleId, name, email, avatar } = req.user;

    if (!email) {
      throw new AppError('Google account must have an email associated.', 400);
    }

    let user = await User.findOne({ email }).populate('workspace');

    if (!user) {
      // Create new OAuth user
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        authProviders: ['google'],
      });
    } else {
      // Update existing user with OAuth info if not already linked
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }

      if (!user.authProviders.includes('google')) {
        user.authProviders.push('google');
        updated = true;
      }

      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }

      if (updated) {
        await user.save({ validateBeforeSave: false });
      }
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

    return res.redirect(config.FRONTEND_URL);
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await User.findOne({ email });

    // For security, always return success message
    if (!user) {
      return res.status(200).json({
        message: 'If an account exists with that email, a reset link was sent.',
      });
    }

    // Generate 32-byte hex token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash it and store in DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save({ validateBeforeSave: false });

    // Send email
    await sendPasswordResetEmail(email, user.name, resetToken);

    return res.status(200).json({
      message: 'If an account exists with that email, a reset link was sent.',
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError('Token and password are required', 400);
    }

    // Hash the incoming token to match what's in DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Check if new password is the same as the old one (if a password exists)
    if (user.password) {
      const isSamePassword = await user.comparePassword(password);
      if (isSamePassword) {
        throw new AppError(
          'New password cannot be the same as your current password.',
          400
        );
      }
    }

    // Update password (pre-save hook will hash it)
    user.password = password;

    // Add local to authProviders if it's not there (for Google users)
    if (!user.authProviders.includes('local')) {
      user.authProviders.push('local');
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError('Verification token is required', 400);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired verification link', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    return next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await User.findOne({ email }).select(
      '+isVerified +lastVerificationSentAt'
    );

    if (!user) {
      // Security: Don't reveal if user exists
      return res.status(200).json({
        message:
          'If an account exists with that email, a new verification link was sent.',
      });
    }

    if (user.isVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Cooldown check
    const now = new Date();
    const lastSent = user.lastVerificationSentAt;
    const cooldownPeriod = 60 * 1000;

    if (lastSent && now - lastSent < cooldownPeriod) {
      const remainingTime = Math.ceil(
        (cooldownPeriod - (now - lastSent)) / 1000
      );
      throw new AppError(
        `Please wait ${remainingTime} seconds before requesting another email.`,
        429
      );
    }

    // Generate and send
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    user.verificationToken = hashedToken;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.lastVerificationSentAt = new Date();

    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(email, user.name, verificationToken);

    return res.status(200).json({
      message: 'Verification link sent successfully. Please check your inbox.',
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    return next(error);
  }
};
