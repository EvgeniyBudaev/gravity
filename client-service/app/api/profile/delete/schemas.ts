import { z } from "zod";
import { profileSchema } from "@/app/api/profile/add";

export const deleteProfileParamsSchema = z.object({
  id: z.string(),
});

export const deleteProfileResponseSchema = z.object({
  data: profileSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
