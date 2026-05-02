import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'database', 'infra'],
    },
    environment: {
      type: String,
      required: true,
      enum: ['production', 'staging', 'development'],
      default: 'production',
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'deprecated'],
      default: 'active',
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    repoUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique index per workspace + name
serviceSchema.index({ workspace: 1, name: 1 }, { unique: true });

export const Service = mongoose.model('Service', serviceSchema);
