import type { z } from "zod";
import {
  deleteProfileParamsSchema,
  deleteProfileResponseSchema,
} from "@/app/api/profile/delete";

export type TDeleteProfileParams = z.infer<typeof deleteProfileParamsSchema>;
export type TDeleteProfileResponse = z.infer<
  typeof deleteProfileResponseSchema
>;
