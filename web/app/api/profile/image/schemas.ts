import { z } from "zod";

export const imageSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  name: z.string(),
  url: z.string(),
  size: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  isBlocked: z.boolean(),
  isPrimary: z.boolean(),
  isPrivate: z.boolean(),
});
