import { z } from "zod";
export const faqSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().max(10000).nullable().optional(),
  category: z.string().trim().max(100).default("general"),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  published: z.coerce.boolean().default(true),
});
