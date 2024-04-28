import { z } from "zod";
import { likeSchema } from "@/app/api/like/add";

export const cancelLikeParamsSchema = z.object({
  id: z.string(),
});

export const cancelLikeResponseSchema = z.object({
  data: likeSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
