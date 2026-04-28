import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      select: false,
      required: function () {
        return this.provider === 'local';
      },
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    googleId: {
      type: String,
    },

    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },

    avatar: String,
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
