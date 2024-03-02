import { z } from "zod";

export const navigatorSchema = z.object({
  distance: z.number(),
});
