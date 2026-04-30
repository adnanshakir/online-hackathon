import { Workspace } from '../models/workspace.model.js';
import { User } from '../models/user.model.js';
import AppError from '../utils/appError.js';

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    const existing = await Workspace.findOne({ slug });
    if (existing) throw new AppError('Workspace slug already exists', 400);

    const workspace = await Workspace.create({
      name,
      slug,
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
    const { inviteCode } = req.body;

    const workspace = await Workspace.findOne({ inviteCode });
    if (!workspace) throw new AppError('Invalid invite code', 400);

    req.user.workspace = workspace._id;
    req.user.role = 'member';
    await req.user.save();

    return res.status(200).json({ message: 'Joined workspace successfully' });
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

    if (user.workspace?.toString() !== req.user.workspace.toString()) {
      throw new AppError('User not in same workspace', 400);
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'Role updated' });
  } catch (error) {
    return next(error);
  }
};
