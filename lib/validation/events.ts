import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.enum(["tech", "creative"]),
  tagline: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  date: z.string().trim().max(100).nullable().optional(),
  time: z.string().trim().max(100).nullable().optional(),
  teamSize: z.string().trim().max(100).nullable().optional(),
  venue: z.string().trim().max(200).nullable().optional(),
  fee: z.string().trim().max(100).nullable().optional(),
  prize: z.string().trim().max(200).nullable().optional(),
  eligibility: z.string().trim().max(1000).nullable().optional(),
  rules: z.array(z.string().trim().max(1000)).max(100).default([]),
  coordinators: z.string().trim().max(1000).nullable().optional(),
  contact: z.string().trim().max(500).nullable().optional(),
  image: z.string().trim().max(1000).nullable().optional(),
  status: z.enum(["Published", "Draft"]).default("Draft"),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
});
