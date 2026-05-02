import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' });

export const createIncidentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: 'Title must be at least 2 characters' }),
  description: z
    .string()
    .trim()
    .min(3, { message: 'Description must be at least 3 characters' }),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  service: z
    .string({
      required_error: 'Service ID is required',
    })
    .length(24, 'Invalid Service ID format'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['investigating', 'identified', 'monitoring', 'resolved']),
});

export const assignUsersSchema = z.object({
  // Accept only valid user ObjectIds when provided.
  assignedTo: z.array(objectIdSchema).min(1).optional(),
});
