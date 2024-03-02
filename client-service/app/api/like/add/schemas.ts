import { z } from "zod";

export const addLikeParamsSchema = z.object({
  sessionId: z.string(),
  humanId: z.string(),
});

export const likeSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  humanId: z.string(),
  isLiked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const addLikeResponseSchema = z.object({
  data: likeSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
