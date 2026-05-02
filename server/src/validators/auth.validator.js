import { z } from 'zod';

const messages = {
  nameRequired: 'Name is required',
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordInvalid: 'Password must be at least 8 characters long',
};

export const registerSchema = z.object({
  name: z
    .string({ required_error: messages.nameRequired })
    .trim()
    .min(1, { message: messages.nameRequired }),
  email: z
    .string({ required_error: messages.emailRequired })
    .trim()
    .toLowerCase()
    .min(1, { message: messages.emailRequired })
    .email({ message: messages.emailInvalid }),
  password: z
    .string({ required_error: messages.passwordRequired })
    .min(8, { message: messages.passwordInvalid }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: messages.emailRequired })
    .trim()
    .toLowerCase()
    .min(1, { message: messages.emailRequired })
    .email({ message: messages.emailInvalid }),
  password: z
    .string({ required_error: messages.passwordRequired })
    .min(1, { message: messages.passwordRequired }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: messages.emailRequired })
    .trim()
    .toLowerCase()
    .min(1, { message: messages.emailRequired })
    .email({ message: messages.emailInvalid }),
});

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token is required' }).min(1),
  password: z
    .string({ required_error: messages.passwordRequired })
    .min(8, { message: messages.passwordInvalid }),
});

export const verifyEmailSchema = z.object({
  token: z.string({ required_error: 'Token is required' }).min(1),
});

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: messages.emailRequired })
    .trim()
    .toLowerCase()
    .min(1, { message: messages.emailRequired })
    .email({ message: messages.emailInvalid }),
});

export { messages as authMessages };
