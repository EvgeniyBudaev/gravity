import { z } from "zod";

export const updateParamsSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  mobileNumber: z.string(),
  userName: z.string(),
});

export const updateSchema = z.any();
