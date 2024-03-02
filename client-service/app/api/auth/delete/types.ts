import type { z } from "zod";
import {
  deleteParamsSchema,
  deleteSchema,
} from "@/app/api/auth/delete/schemas";

export type TDeleteParams = z.infer<typeof deleteParamsSchema>;
export type TDelete = z.infer<typeof deleteSchema>;
