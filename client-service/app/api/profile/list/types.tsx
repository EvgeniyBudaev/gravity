import type { z } from "zod";
import {
  profileListParamsSchema,
  profileListResponseSchema,
  profileListSchema,
} from "@/app/api/profile/list/schemas";

export type TProfileList = z.infer<typeof profileListSchema>;
export type TProfileListParams = z.infer<typeof profileListParamsSchema>;
export type TProfileListResponse = z.infer<typeof profileListResponseSchema>;
