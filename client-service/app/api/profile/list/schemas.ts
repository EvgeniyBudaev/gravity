import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

const imageListItemSchema = z.object({
  url: z.string(),
});

const profileListItemSchema = z.object({
  id: z.number(),
  isOnline: z.boolean(),
  lastOnline: z.string(),
  image: imageListItemSchema,
});

export const profileListParamsSchema = z.object({
  page: z.string(),
  size: z.string(),
  ageFrom: z.string(),
  ageTo: z.string(),
  searchGender: z.string(),
  lookingFor: z.string(),
  sessionId: z.string(),
  distance: z.string(),
  latitude: z.string().nullish(),
  longitude: z.string().nullish(),
});

export const profileListSchema = paginationSchema.extend({
  content: profileListItemSchema.array(),
});

export const profileListResponseSchema = z.object({
  data: profileListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
