import type { z } from "zod";
import {
  reviewDetailParamsSchema,
  reviewDetailResponseSchema,
} from "@/app/api/review/detail/schemas";

export type TReviewDetailParams = z.infer<typeof reviewDetailParamsSchema>;
export type TReviewDetailResponse = z.infer<typeof reviewDetailResponseSchema>;
