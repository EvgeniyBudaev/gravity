import { z } from "zod";

export const addComplaintParamsSchema = z.object({
  sessionId: z.string(),
  complaintUserId: z.string(),
  reason: z.string(),
});

export const complaintSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  complaintUserId: z.string(),
  reason: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const addComplaintResponseSchema = z.object({
  data: complaintSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
