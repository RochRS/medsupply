import { z } from "zod";

export const requestItemSchema = z.object({
  requestId: z.number(),
  requestBatchId: z.number().optional(),
  requestedAmount: z.number(),
  isUrgent: z.boolean().nullable().optional(),
  isCompleted: z.boolean().nullable().optional(),
  itemName: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const requestsResponseSchema = z.object({
  requests: z.array(requestItemSchema),
});

export const singleRequestResponseSchema = z.object({
  request: requestItemSchema,
});

export const createRequestInputSchema = z.object({
  itemId: z.number().positive(),
  requestedAmount: z.number().positive(),
  requestBatchId: z.number().positive().optional(),
  userId: z.string().nullable().optional(),
  departmentId: z.number().positive().nullable().optional(),
  requestDescriptionField: z.string().nullable().optional(),
});

export type RequestItem = z.infer<typeof requestItemSchema>;
export type CreateRequestInput = z.infer<typeof createRequestInputSchema>;