import { z } from "zod";
import { zfd } from "zod-form-data";
import { filterSchema } from "@/app/api/profile/filter";
import { imageSchema } from "@/app/api/profile/image";
import { navigatorSchema } from "@/app/api/profile/navigator";
import { telegramSchema } from "@/app/api/profile/telegram";
import { fileSchema } from "@/app/api/upload";
import { EGender } from "@/app/shared/enums/form";

export const addProfileParamsSchema = zfd.formData({
  sessionId: zfd.text(),
  displayName: zfd.text(),
  birthday: zfd.text(),
  gender: zfd.text(),
  searchGender: zfd.text(),
  location: zfd.text().nullish(),
  description: zfd.text().nullish(),
  height: zfd.text().nullish(),
  weight: zfd.text().nullish(),
  lookingFor: zfd.text().nullish(),
  image: fileSchema.or(fileSchema.array()).nullish(),
  telegramId: zfd.text(),
  firstName: zfd.text().nullish(),
  lastName: zfd.text().nullish(),
  username: zfd.text(),
  languageCode: zfd.text(),
  allowsWriteToPm: zfd.text(),
  queryId: zfd.text(),
  latitude: zfd.text(),
  longitude: zfd.text(),
  ageFrom: zfd.text(),
  ageTo: zfd.text(),
  distance: zfd.text(),
  page: zfd.text(),
  size: zfd.text(),
});

export const profileSchema = z.object({
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
  createdAt: z.string(),
  updatedAt: z.string(),
  lastOnline: z.string(),
  images: imageSchema.array().nullish(),
  telegram: telegramSchema.nullish(),
  navigator: navigatorSchema.nullish(),
  filters: filterSchema.nullish(),
});

export const addProfileResponseSchema = z.object({
  data: profileSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
