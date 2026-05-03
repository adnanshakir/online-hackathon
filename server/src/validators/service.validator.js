import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z
    .string({
      required_error: 'Service name is required',
    })
    .min(2, 'Name must be at least 2 characters'),

  description: z
    .string()
    .max(300, 'Description must be under 300 characters')
    .optional(),

  type: z.enum(['frontend', 'backend', 'database', 'infra'], {
    required_error: 'Service type is required',
  }),

  environment: z.enum(['production', 'staging', 'development']).optional(),

  status: z.enum(['active', 'maintenance', 'deprecated']).optional(),

  healthStatus: z
    .enum(['operational', 'degraded', 'down', 'maintenance'])
    .optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
