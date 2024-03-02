import { z } from "zod";

export const reviewDetailParamsSchema = z.object({
  id: z.string(),
});

const reviewDetailSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  message: z.string(),
  rating: z.number(),
  hasDeleted: z.boolean(),
  hasEdited: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sessionId: z.string(),
});

export const reviewDetailResponseSchema = z.object({
  data: reviewDetailSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
