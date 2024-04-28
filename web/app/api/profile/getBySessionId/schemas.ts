import { z } from "zod";
import { filterSchema } from "@/app/api/profile/filter";

const imageListItemSchema = z.object({
  url: z.string(),
});

const telegramSchema = z.object({
  telegramId: z.number(),
});

export const profileBySessionIdSchema = z.object({
  id: z.number(),
  sessionId: z.string(),
  isDeleted: z.boolean(),
  isBlocked: z.boolean(),
  image: imageListItemSchema,
  filter: filterSchema,
  telegram: telegramSchema,
});

export const profileBySessionIdParamsSchema = z.object({
  sessionId: z.string(),
  latitude: z.string().nullish(),
  longitude: z.string().nullish(),
});

export const profileBySessionIdResponseSchema = z.object({
  data: profileBySessionIdSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
