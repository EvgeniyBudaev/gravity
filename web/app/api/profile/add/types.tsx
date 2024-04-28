import type { z } from "zod";
import {
  addProfileParamsSchema,
  addProfileResponseSchema,
  profileSchema,
} from "@/app/api/profile/add/schemas";

export type TProfile = z.infer<typeof profileSchema>;
export type TAddProfileParams = z.infer<typeof addProfileParamsSchema>;
export type TAddProfileResponse = z.infer<typeof addProfileResponseSchema>;
