import type { z } from "zod";
import {
  editProfileParamsSchema,
  editProfileResponseSchema,
} from "@/app/api/profile/edit";

export type TEditProfileParams = z.infer<typeof editProfileParamsSchema>;
export type TEditProfileResponse = z.infer<typeof editProfileResponseSchema>;
