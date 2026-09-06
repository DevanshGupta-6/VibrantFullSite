import { z } from "zod";
export const createAdminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(256),
  roleId: z.string().min(1),
  scope: z.string().trim().max(200).default("Global"),
  status: z.enum(["ACTIVE","DISABLED","PENDING"]).default("ACTIVE"),
});
export const updateAdminSchema = createAdminSchema.omit({ password: true }).extend({
  password: z.string().min(12).max(256).optional().or(z.literal("")),
});
