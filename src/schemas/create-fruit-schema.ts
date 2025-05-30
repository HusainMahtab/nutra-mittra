import { z } from "zod";

export const createFruitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["fruit", "vegetable"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z.string().optional(),
  calories: z.string().optional(),
  vitamins: z.array(z.string()).optional().default([]),
  minerals: z.record(z.string(), z.number()).refine(
    (minerals) => Object.keys(minerals).length > 0,
    {
      message: "At least one mineral is required",
    }
  ),
  healthBenefits: z.array(z.string()).optional().default([]),
  seasonalAvailability: z.string().optional(),
  isOrganic: z.boolean().default(false),
  originStory: z.string().optional(),
});

export type CreateFruitFormValues = z.infer<typeof createFruitSchema>;

