import type { z } from "zod";
import {
  updateLikeParamsSchema,
  updateLikeResponseSchema,
} from "@/app/api/like/update/schemas";

export type TUpdateLikeParams = z.infer<typeof updateLikeParamsSchema>;
export type TUpdateLikeResponse = z.infer<typeof updateLikeResponseSchema>;
