import type { z } from "zod";
import {
  updateParamsSchema,
  updateSchema,
} from "@/app/api/auth/update/schemas";

export type TUpdateParams = z.infer<typeof updateParamsSchema>;
export type TUpdate = z.infer<typeof updateSchema>;
