import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true,
    },

    password: {
      type: String,
      select: false,
      minlength: 8,
      required: function () {
        return this.authProviders.includes('local');
      },
    },

    refreshToken: {
      type: String,
      select: false,
    },

    authProviders: {
      type: [String],
      enum: ['local', 'google'],
      default: ['local'],
    },

    googleId: {
      type: String,
      index: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
    },

    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },

    avatar: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

/**
 * Hash password before saving (safety net)
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.authProviders.includes('local')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare password method
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model('User', userSchema);
