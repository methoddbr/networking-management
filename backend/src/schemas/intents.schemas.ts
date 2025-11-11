import { z } from "zod";

export const createIntentSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

export const adminListQuerySchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const acceptIntentParamsSchema = z.object({
  id: z.uuid(),
});
