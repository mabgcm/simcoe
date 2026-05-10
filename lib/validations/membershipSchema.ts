import { z } from "zod";

export const membershipSchema = z.object({
  membershipType: z.enum(["individual", "family", "student", "corporate"]),
  userId: z.string().min(1),
  userEmail: z.string().email()
});
