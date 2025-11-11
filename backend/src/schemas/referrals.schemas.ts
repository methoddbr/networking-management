import { z } from "zod";

export const createReferralSchema = z.object({
  toMemberId: z.string().uuid(),
  clientName: z.string().min(1),
  description: z.string().optional(),
  valueEstimated: z.number().optional(),
});

export const updateReferralSchema = z.object({
  status: z.enum(["open", "contacted", "in_progress", "won", "lost"]),
  description: z.string().optional(),
  valueEstimated: z.number().optional(),
});

export const thankParamsSchema = z.object({
  id: z.string().uuid(),
});

export const thankBodySchema = z.object({
  message: z.string().min(1),
});


