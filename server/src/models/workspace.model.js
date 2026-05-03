import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    systemContext: {
      projectName: { type: String, trim: true },
      liveUrl: { type: String, trim: true },
      stackPreset: { type: String, trim: true },
      techStack: [{ type: String, trim: true }],
      integrations: [{ type: String, trim: true }],
      repoUrl: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Workspace = mongoose.model('Workspace', workspaceSchema);
