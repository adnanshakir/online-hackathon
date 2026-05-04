import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.MAIL_USER,
    clientId: config.MAIL_CLIENT_ID,
    clientSecret: config.MAIL_CLIENT_SECRET,
    refreshToken: config.MAIL_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error) => {
  if (error) {
    logger.error('Error connecting to email server:', error);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #333;">Password Reset Request</h1>
      <p style="color: #666; font-size: 16px;">Hello ${name}, someone requested a password reset for your account.</p>
      <p style="color: #666; font-size: 16px;">If this was you, please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}"
           style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Reset Password
        </a>
      </div>
      <p style="color: #999; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return await transporter.sendMail({
    from: `"OpsWatch" <${config.MAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const sendVerificationEmail = async (email, name, token, userId) => {
  try {
    const verificationLink = `${config.FRONTEND_URL}/verify-email?token=${token}&u=${userId}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #333;">Welcome to OpsWatch, ${name}!</h1>
        <p style="color: #666; font-size: 16px;">Please verify your email address to get started.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
             Verify Email Address
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"OpsWatch" <${config.MAIL_USER}>`,
      to: email,
      subject: 'Verify your email',
      html,
    });
  } catch (err) {
    console.error('Email failed:', err.message);
  }
};

export const sendWorkspaceInvite = async (
  email,
  inviterName,
  workspaceName,
  inviteCode,
  inviteToken
) => {
  const joinLink = `${config.FRONTEND_URL}/join?token=${inviteToken}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #333;">You're invited to join ${workspaceName} on OpsWatch</h1>
      <p style="color: #666; font-size: 16px;">Hello! ${inviterName} has invited you to join their incident control room.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${joinLink}"
           style="background-color: #8b5cf6; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Join Workspace
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">This invitation was sent to <strong>${email}</strong>.</p>
      <p style="color: #666; font-size: 14px;">Alternatively, you can use this invite code: <strong>${inviteCode}</strong></p>
      <p style="color: #999; font-size: 12px;">Welcome to the team!</p>
    </div>
  `;

  return await transporter.sendMail({
    from: `"OpsWatch" <${config.MAIL_USER}>`,
    to: email,
    subject: `Invitation to join ${workspaceName} on OpsWatch`,
    html,
  });
};

export default transporter;
