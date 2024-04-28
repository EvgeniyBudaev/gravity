import { z } from "zod";

export const addBlockParamsSchema = z.object({
  sessionId: z.string(),
  blockedUserId: z.string(),
});

export const blockSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  blockedUserId: z.string(),
  isBlocked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const addBlockResponseSchema = z.object({
  data: blockSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
