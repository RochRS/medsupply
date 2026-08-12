import { z } from "zod";

// ---- create schema ----

export const createRequestSchema = z.object({
  itemId: z.number().int().positive(),
  requestedAmount: z.number().int().positive(),
  requestBatchId: z
    .number()
    .int()
    .positive()
    .max(2_147_483_647)
    .optional(),
  userId: z.string().nullable().optional(),
  departmentId: z.number().int().positive().nullable().optional(),
  requestDescriptionField: z.string().nullable().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;