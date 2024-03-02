import type { z } from "zod";
import {
  profileDetailSchema,
  profileDetailParamsSchema,
  profileDetailResponseSchema,
} from "@/app/api/profile/detail/schemas";

export type TProfileDetailParams = z.infer<typeof profileDetailParamsSchema>;
export type TProfileDetail = z.infer<typeof profileDetailSchema>;
export type TProfileDetailResponse = z.infer<
  typeof profileDetailResponseSchema
>;
