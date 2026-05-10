import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  address: z.string().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  price: z.coerce.number().min(0),
  capacity: z.coerce.number().min(1).nullable().optional()
});
