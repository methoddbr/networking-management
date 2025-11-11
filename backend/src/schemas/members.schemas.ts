import { z } from "zod";

export const createMemberSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export const listMembersQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});
