import { z } from 'zod';

export const addUpdateSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, { message: 'Message must be at least 2 characters' }),
  type: z.enum(['log', 'comment', 'status_change']).optional(),
});
