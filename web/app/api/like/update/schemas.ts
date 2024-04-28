import { z } from "zod";
import { likeSchema } from "@/app/api/like/add";

export const updateLikeParamsSchema = z.object({
  id: z.string(),
});

export const updateLikeResponseSchema = z.object({
  data: likeSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
