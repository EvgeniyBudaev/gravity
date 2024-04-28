import { z } from "zod";
import { EGender } from "@/app/shared/enums/form";
import { imageSchema } from "@/app/api/profile/image";
import { telegramSchema } from "@/app/api/profile/telegram";
import { navigatorSchema } from "@/app/api/profile/navigator";
import { filterSchema } from "@/app/api/profile/filter";

export const profileDetailParamsSchema = z.object({
  id: z.string(),
  viewerId: z.string(),
  latitude: z.string().nullish(),
  longitude: z.string().nullish(),
});

const likeSchema = z.object({
  id: z.number().nullish(),
  isLiked: z.boolean(),
  updatedAt: z.string().nullish(),
});

export const profileDetailSchema = z.object({
  id: z.number(),
  sessionId: z.string(),
  displayName: z.string(),
  birthday: z.string(),
  gender: z.enum([EGender.Man, EGender.Woman]),
  location: z.string().nullish(),
  description: z.string().nullish(),
  height: z.number().nullish(),
  weight: z.number().nullish(),
  isDeleted: z.boolean(),
  isBlocked: z.boolean(),
  isPremium: z.boolean(),
  isShowDistance: z.boolean(),
  isInvisible: z.boolean(),
  isOnline: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastOnline: z.string(),
  images: imageSchema.array().nullish(),
  telegram: telegramSchema.nullish(),
  navigator: navigatorSchema.nullish(),
  filters: filterSchema.nullish(),
  like: likeSchema.nullish(),
});

export const profileDetailResponseSchema = z.object({
  data: profileDetailSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
