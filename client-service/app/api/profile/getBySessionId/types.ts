import type { z } from "zod";
import {
  profileBySessionIdParamsSchema,
  profileBySessionIdResponseSchema,
  profileBySessionIdSchema,
} from "@/app/api/profile/getBySessionId/schemas";

export type TProfileBySessionId = z.infer<typeof profileBySessionIdSchema>;
export type TProfileBySessionIdParams = z.infer<
  typeof profileBySessionIdParamsSchema
>;
export type TProfileBySessionIdResponse = z.infer<
  typeof profileBySessionIdResponseSchema
>;
