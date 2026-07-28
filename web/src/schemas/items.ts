import { z } from "zod";

export const itemSchema = z.object({
  itemId: z.number(),
  itemName: z.string(),
  remainingAmount: z.number(),
  stockLevel: z.enum(["critical", "low", "ok"]).optional(),
  description: z.string().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const itemsResponseSchema = z.object({
  items: z.array(itemSchema),
});

export const itemDetailResponseSchema = z.object({
  item: itemSchema,
});

export const itemsSummarySchema = z.object({
  items: z.array(itemSchema),
  summary: z.object({
    totalItems: z.number(),
    totalStock: z.number(),
    criticalStock: z.number(),
    lowStock: z.number(),
  }),
});

export type Item = z.infer<typeof itemSchema>;
export type ItemsSummary = z.infer<typeof itemsSummarySchema>;