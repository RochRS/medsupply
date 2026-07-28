import { z } from "zod";

export const createItemSchema = z.object({
  itemName: z.string().min(1),
  description: z.string().optional(),
  remainingAmount: z.number().int().nonnegative(),
  categoryId: z.number().int().positive().optional(),
});

export const updateItemSchema = z
  .object({
    itemName: z.string().min(1).optional(),
    description: z.string().optional(),
    remainingAmount: z.number().int().nonnegative().optional(),
    categoryId: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
