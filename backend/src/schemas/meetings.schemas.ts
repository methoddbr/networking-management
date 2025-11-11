import { z } from "zod";

export const createMeetingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.iso.datetime(),
  location: z.string().optional(),
});

export const checkinSchema = z.object({
  status: z.enum(["present", "absent", "late"]).default("present"),
});

export const listMeetingsQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});
