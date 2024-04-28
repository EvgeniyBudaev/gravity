import { z } from "zod";

export const telegramSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  telegramId: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  languageCode: z.string(),
  allowsWriteToPm: z.boolean(),
  queryId: z.string(),
});
