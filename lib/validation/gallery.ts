import { z } from "zod";
export const gallerySchema = z.object({
  src: z.string().trim().min(1).max(2000),
  alt: z.string().trim().min(1).max(300),
  category: z.enum(["tech", "cultural", "performances", "bts"]),
  caption: z.string().trim().max(1000).nullable().optional(),
  aspectRatio: z.enum(["portrait", "landscape", "square", "wide"]).default("square"),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  published: z.coerce.boolean().default(true),
});
