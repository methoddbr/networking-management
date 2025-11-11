import { z } from "zod";

export const createMeetingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string().optional(),
});

export const checkinSchema = z.object({
  status: z.enum(["present", "absent", "late"]).optional().default("present"),
});

export const listMeetingsQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const meetingParamsSchema = z.object({
  id: z.string().uuid(),
});
