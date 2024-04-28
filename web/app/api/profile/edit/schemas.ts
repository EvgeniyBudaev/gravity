import { z } from "zod";
import { zfd } from "zod-form-data";
import { profileSchema } from "@/app/api/profile/add";
import { fileSchema } from "@/app/api/upload";

export const editProfileParamsSchema = zfd.formData({
  id: zfd.text(),
  displayName: zfd.text(),
  birthday: zfd.text(),
  gender: zfd.text(),
  searchGender: zfd.text(),
  location: zfd.text(),
  description: zfd.text(),
  height: zfd.text(),
  weight: zfd.text(),
  lookingFor: zfd.text(),
  image: fileSchema.or(fileSchema.array()).nullish(),
  telegramId: zfd.text(),
  firstName: zfd.text(),
  lastName: zfd.text().nullish(),
  username: zfd.text(),
  languageCode: zfd.text(),
  allowsWriteToPm: zfd.text(),
  queryId: zfd.text(),
  latitude: zfd.text(),
  longitude: zfd.text(),
});

export const editProfileResponseSchema = z.object({
  data: profileSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
