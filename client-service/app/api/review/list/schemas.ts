import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

export const reviewListItemSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  message: z.string().nullish(),
  rating: z.number(),
  hasDeleted: z.boolean(),
  hasEdited: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  displayName: z.string(),
  sessionId: z.string(),
});

export const reviewListParamsSchema = z.object({
  page: z.string(),
  size: z.string(),
  profileId: z.string(),
});

export const reviewListSchema = paginationSchema.extend({
  ratingAverage: z.number(),
  countItemsTodayByProfile: z.number(),
  content: reviewListItemSchema.array(),
});

export const reviewListResponseSchema = z.object({
  data: reviewListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
