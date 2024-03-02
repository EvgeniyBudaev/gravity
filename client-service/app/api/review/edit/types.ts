import type { z } from "zod";
import {
  editReviewParamsSchema,
  editReviewResponseSchema,
} from "@/app/api/review/edit/schemas";

export type TEditReviewParams = z.infer<typeof editReviewParamsSchema>;
export type TEditReviewResponse = z.infer<typeof editReviewResponseSchema>;
