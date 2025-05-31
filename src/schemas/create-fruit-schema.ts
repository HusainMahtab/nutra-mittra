// @/schemas/create-fruit-schema.ts

import { z } from "zod";

export const createFruitSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["fruit", "vegetable"]),
  description: z.string().optional(),
  calories: z.string(), // or z.number().optional() depending on your handling
  vitamins: z.array(z.string()).default([]),  // 🔥 Ensures it's never undefined
  minerals: z.record(z.string(), z.number()).default({}),  // 🔥 Same here
  healthBenefits: z.array(z.string()).default([]),  // 🔥 Ensures it's always an array
  seasonalAvailability: z.string().optional(),
  isOrganic: z.boolean(),
  originStory: z.string().optional(),
});

export type CreateFruitFormValues = z.infer<typeof createFruitSchema>;
