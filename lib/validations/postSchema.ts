import { z } from "zod";

export const postSchema = z.object({
  content: z.string().min(3).max(1000),
  imageUrl: z.string().url().optional()
});
