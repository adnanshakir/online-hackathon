import { z } from 'zod';

const messages = {
  nameRequired: 'Name is required',
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordInvalid: 'Password must be at least 8 characters long',
};

export const registerSchema = z
  .object({
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
    password: z.string().optional(),
    provider: z.enum(['local', 'google']).optional(),
  })
  .superRefine((data, context) => {
    const provider = data.provider ?? 'local';

    if (provider === 'local' && !data.password) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: messages.passwordRequired,
      });
      return;
    }

    if (data.password && data.password.length < 8) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: messages.passwordInvalid,
      });
    }
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

export { messages as authMessages };
