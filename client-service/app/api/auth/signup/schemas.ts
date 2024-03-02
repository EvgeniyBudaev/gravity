import { z } from "zod";

export const signupParamsSchema = z.object({
  email: z.string().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  mobileNumber: z.string(),
  password: z.string(),
  userName: z.string(),
});

export const signupSchema = z.any();
