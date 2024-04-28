import type { z } from "zod";
import {
  addBlockParamsSchema,
  addBlockResponseSchema,
  blockSchema,
} from "@/app/api/block/add/schemas";

export type TBlock = z.infer<typeof blockSchema>;
export type TAddBlockParams = z.infer<typeof addBlockParamsSchema>;
export type TAddBlockResponse = z.infer<typeof addBlockResponseSchema>;
