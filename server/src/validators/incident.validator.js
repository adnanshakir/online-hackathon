import { z } from 'zod';

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
  assignedTo: z.array(z.string()).min(1).optional(),
});

export const updateIncidentSchema = createIncidentSchema.partial();
