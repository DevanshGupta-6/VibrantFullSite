import { z } from "zod";
export const sponsorSchema = z.object({
  name: z.string().trim().min(1).max(200),
  tier: z.enum(["Title Sponsor", "Powered By", "Co-Sponsors", "Partners"]),
  logo: z.string().trim().max(1000).nullable().optional(),
  url: z.string().trim().url().max(2000).nullable().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  published: z.coerce.boolean().default(true),
});
