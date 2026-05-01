import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string({
    required_error: 'Service name is required',
  }).min(2, 'Name must be at least 2 characters'),
  
  type: z.enum(['frontend', 'backend', 'database', 'infra'], {
    required_error: 'Service type is required',
  }),
  
  techStack: z.array(z.string()).min(1, 'At least one technology must be listed'),
});
