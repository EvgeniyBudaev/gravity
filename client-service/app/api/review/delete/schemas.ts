import { z } from "zod";
import { reviewDetailSchema } from "@/app/api/review/add";

export const deleteReviewParamsSchema = z.object({
  id: z.string(),
});

export const deleteReviewResponseSchema = z.object({
  data: reviewDetailSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
