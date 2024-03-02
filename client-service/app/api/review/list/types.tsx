import type { z } from "zod";
import {
  reviewListItemSchema,
  reviewListParamsSchema,
  reviewListResponseSchema,
  reviewListSchema,
} from "@/app/api/review/list/schemas";

export type TReviewList = z.infer<typeof reviewListSchema>;
export type TReviewListItem = z.infer<typeof reviewListItemSchema>;
export type TReviewListParams = z.infer<typeof reviewListParamsSchema>;
export type TReviewListResponse = z.infer<typeof reviewListResponseSchema>;
