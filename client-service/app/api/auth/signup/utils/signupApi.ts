import { fetchApi, TApiFunction } from "@/app/api";
import type { TSignup, TSignupParams } from "@/app/api/auth/signup";
import { EFormMethods } from "@/app/shared/enums";

export const signupApi: TApiFunction<TSignupParams, TSignup> = (params) => {
  return fetchApi<TSignup>(`/api/v1/user/register`, {
    method: EFormMethods.Post,
    body: params,
  });
};
