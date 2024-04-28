import { z } from "zod";
import { zfd } from "zod-form-data";

export const addReviewParamsSchema = zfd.formData({
  profileId: zfd.text(),
  message: zfd.text(),
  rating: zfd.text(),
});

export const reviewDetailSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  message: z.string(),
  rating: z.number(),
  hasDeleted: z.boolean(),
  hasEdited: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sessionId: z.string().optional(),
});

export const addReviewResponseSchema = z.object({
  data: reviewDetailSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
