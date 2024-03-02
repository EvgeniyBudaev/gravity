import type { z } from "zod";
import {
  addReviewParamsSchema,
  addReviewResponseSchema,
  reviewDetailSchema,
} from "@/app/api/review/add/schemas";

export type TReviewDetail = z.infer<typeof reviewDetailSchema>;
export type TAddReviewParams = z.infer<typeof addReviewParamsSchema>;
export type TAddReviewResponse = z.infer<typeof addReviewResponseSchema>;
