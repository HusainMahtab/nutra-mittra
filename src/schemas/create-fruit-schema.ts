// @/schemas/create-fruit-schema.ts

import { z } from "zod";

export const createFruitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["fruit", "vegetable"]),
  description: z.string().optional(),
  calories: z.string().optional(),
  seasonalAvailability: z.string().optional(),
  isOrganic: z.boolean(),
  vitamins: z.array(z.string()).default([]), // ✅ Default to empty array
  healthBenefits: z.array(z.string()).default([]), // ✅ Default to empty array
  minerals: z.record(z.string(), z.number()).default({}), // ✅ Default to empty object
});

export type CreateFruitFormValues = z.infer<typeof createFruitSchema>;
