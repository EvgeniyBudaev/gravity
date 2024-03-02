import { z } from "zod";
import { zfd } from "zod-form-data";
import { reviewDetailSchema } from "@/app/api/review/add";

export const editReviewParamsSchema = zfd.formData({
  id: zfd.text(),
  profileId: zfd.text(),
  message: zfd.text(),
  rating: zfd.text(),
});

export const editReviewResponseSchema = z.object({
  data: reviewDetailSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
