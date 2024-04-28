import type { z } from "zod";
import {
  deleteImageParamsSchema,
  deleteImageResponseSchema,
} from "@/app/api/profile/image/delete/schemas";

export type TDeleteImageParams = z.infer<typeof deleteImageParamsSchema>;
export type TDeleteImageResponse = z.infer<typeof deleteImageResponseSchema>;
