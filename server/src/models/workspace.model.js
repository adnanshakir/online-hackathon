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
    invites: [
      {
        email: { type: String, required: true, lowercase: true, trim: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['pending', 'accepted'],
          default: 'pending',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    statusPageSettings: {
      siteName: { type: String, default: 'OpsWatch Status' },
      slug: { type: String, lowercase: true, trim: true },
      theme: {
        type: String,
        enum: ['dark', 'light', 'system'],
        default: 'dark',
      },
      logo: { type: String, default: null },
      showUptime: { type: Boolean, default: true },
      showIncidents: { type: Boolean, default: true },
      showSubscribers: { type: Boolean, default: true },
      announcement: {
        message: { type: String, default: null },
        type: {
          type: String,
          enum: ['info', 'warning', 'critical'],
          default: 'info',
        },
        isActive: { type: Boolean, default: false },
      },
      insights: {
        visitors24h: { type: Number, default: 0 },
        subscribers: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Workspace = mongoose.model('Workspace', workspaceSchema);
