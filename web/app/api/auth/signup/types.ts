import type { z } from "zod";
import {
  signupParamsSchema,
  signupSchema,
} from "@/app/api/auth/signup/schemas";

export type TSignupParams = z.infer<typeof signupParamsSchema>;
export type TSignup = z.infer<typeof signupSchema>;
