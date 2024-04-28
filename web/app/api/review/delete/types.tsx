import type { z } from "zod";
import {
  deleteReviewParamsSchema,
  deleteReviewResponseSchema,
} from "@/app/api/review/delete/schemas";

export type TDeleteReviewParams = z.infer<typeof deleteReviewParamsSchema>;
export type TDeleteReviewResponse = z.infer<typeof deleteReviewResponseSchema>;
