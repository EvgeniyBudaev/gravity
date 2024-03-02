import { z } from "zod";
import { imageSchema } from "@/app/api/profile/image";
import { zfd } from "zod-form-data";

export const deleteImageParamsSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

export const deleteImageResponseSchema = z.object({
  data: imageSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
