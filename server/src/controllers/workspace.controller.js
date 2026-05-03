import jwt from 'jsonwebtoken';
import { Workspace } from '../models/workspace.model.js';
import { User } from '../models/user.model.js';
import { Service } from '../models/service.model.js';
import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import AppError from '../utils/appError.js';
import { sendWorkspaceInvite } from '../services/mail.service.js';
import { notifyWorkspace } from './notification.controller.js';
import { config } from '../config/config.js';

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, slug, systemContext } = req.body;

    if (req.user.workspace) {
      throw new AppError('You already belong to a workspace', 400);
    }

    const workspace = await Workspace.create({
      name,
      slug,
      systemContext: systemContext || {},
      inviteCode: generateInviteCode(),
      createdBy: req.user._id,
    });

    // make creator owner
    req.user.workspace = workspace._id;
    req.user.role = 'owner';
    await req.user.save();

    return res.status(201).json(workspace);
  } catch (error) {
    return next(error);
  }
};

export const joinWorkspace = async (req, res, next) => {
  try {
    const { inviteCode, token } = req.body;

    if (req.user.workspace) {
      throw new AppError('You are already a member of a workspace', 400);
    }

    let targetInviteCode = inviteCode;

    if (token) {
      try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        
        // Ensure the invite is for the currently logged in user
        if (decoded.email !== req.user.email) {
          throw new AppError(
            `This invitation was sent to ${decoded.email}, but you are logged in as ${req.user.email}. Please logout and use the correct account.`,
            403
          );
        }
        
        targetInviteCode = decoded.inviteCode;
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Invalid or expired invitation token', 400);
      }
    }

    if (!targetInviteCode) {
      throw new AppError('Invite code or token is required', 400);
    }

    const workspace = await Workspace.findOne({ inviteCode: targetInviteCode });
    if (!workspace) throw new AppError('Invalid invite code', 400);

    req.user.workspace = workspace._id;
    req.user.role = 'member';
    await req.user.save();

    // Notify admins/owners about the new member
    notifyWorkspace({
      actorId: req.user._id,
      workspaceId: workspace._id,
      type: 'workspace',
      title: 'New Member Joined',
      message: `${req.user.name} has joined the workspace`,
      link: '/settings/team',
    });

    return res.status(200).json({ 
      message: 'Joined workspace successfully',
      workspace: {
        id: workspace._id,
        name: workspace.name,
        slug: workspace.slug
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    if (!req.user.workspace) {
      throw new AppError('No workspace assigned', 400);
    }

    const { userId, role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    // only owner can change roles
    if (req.user.role !== 'owner') {
      throw new AppError('Forbidden', 403);
    }

    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    if (
      user.workspace?.toString() !==
      (req.user.workspace._id || req.user.workspace).toString()
    ) {
      throw new AppError('User not in same workspace', 400);
    }

    // ❗ prevent changing owner
    if (user.role === 'owner') {
      throw new AppError('Cannot change owner role', 400);
    }

    // ❗ prevent self role change
    if (user._id.toString() === req.user._id.toString()) {
      throw new AppError('Cannot change your own role', 400);
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'Role updated' });
  } catch (error) {
    return next(error);
  }
};

export const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.user.workspace).select(
      '_id name slug inviteCode createdBy systemContext'
    );

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    return res.status(200).json(workspace);
  } catch (error) {
    return next(error);
  }
};

export const getWorkspaceMembers = async (req, res, next) => {
  try {
    const members = await User.find({ workspace: req.user.workspace })
      .select('_id name email role')
      .lean();

    const rolePriority = { owner: 1, admin: 2, member: 3 };
    members.sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);

    return res.status(200).json({ data: members });
  } catch (error) {
    return next(error);
  }
};

export const regenerateInviteCode = async (req, res, next) => {
  try {
    if (req.user.role !== 'owner') {
      throw new AppError('Forbidden', 403);
    }

    const workspace = await Workspace.findById(req.user.workspace);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    let newCode;
    let exists;

    do {
      newCode = generateInviteCode();
      exists = await Workspace.findOne({ inviteCode: newCode });
    } while (exists);

    workspace.inviteCode = newCode;
    await workspace.save();

    return res.status(200).json({ inviteCode: workspace.inviteCode });
  } catch (error) {
    return next(error);
  }
};

export const inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      throw new AppError('Only owners and admins can invite members', 403);
    }

    const workspace = await Workspace.findById(req.user.workspace);
    if (!workspace) throw new AppError('Workspace not found', 404);

    // Generate a secure invite token tied to the email
    const inviteToken = jwt.sign(
      { 
        email, 
        workspaceId: workspace._id, 
        inviteCode: workspace.inviteCode 
      },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await sendWorkspaceInvite(
      email,
      req.user.name,
      workspace.name,
      workspace.inviteCode,
      inviteToken
    );

    return res.status(200).json({ message: 'Invitation sent' });
  } catch (error) {
    return next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    if (req.user.role !== 'owner') {
      throw new AppError('Forbidden', 403);
    }

    const workspaceId = req.user.workspace;

    if (!workspaceId) {
      throw new AppError('No workspace assigned', 400);
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Cascade delete all workspace-related data, then remove workspace itself
    await Promise.all([
      Update.deleteMany({ workspace: workspaceId }),
      Incident.deleteMany({ workspace: workspaceId }),
      Service.deleteMany({ workspace: workspaceId }),
      User.updateMany(
        { workspace: workspaceId },
        { $unset: { workspace: '' }, role: 'member' }
      ),
    ]);

    await Workspace.findByIdAndDelete(workspaceId);

    return res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateWorkspaceContext = async (req, res, next) => {
  try {
    if (!['owner', 'admin'].includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }

    const workspace = await Workspace.findById(req.user.workspace);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    const allowed = [
      'projectName',
      'liveUrl',
      'stackPreset',
      'techStack',
      'integrations',
      'repoUrl',
    ];

    const hasValidField = Object.keys(req.body).some((key) =>
      allowed.includes(key)
    );

    if (!hasValidField) {
      throw new AppError('No valid fields provided', 400);
    }

    // Ensure systemContext exists on the document
    if (!workspace.systemContext) {
      workspace.systemContext = {};
    }

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        workspace.systemContext[field] = req.body[field];
      }
    });

    await workspace.save();

    return res.status(200).json(workspace.systemContext);
  } catch (error) {
    return next(error);
  }
};
