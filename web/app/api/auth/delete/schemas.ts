import { z } from "zod";

export const deleteParamsSchema = z.object({
  id: z.string(),
});

export const deleteSchema = z.any();
