import type { z } from "zod";
import {
  cancelLikeParamsSchema,
  cancelLikeResponseSchema,
} from "@/app/api/like/cancel/schemas";

export type TCancelLikeParams = z.infer<typeof cancelLikeParamsSchema>;
export type TCancelLikeResponse = z.infer<typeof cancelLikeResponseSchema>;
