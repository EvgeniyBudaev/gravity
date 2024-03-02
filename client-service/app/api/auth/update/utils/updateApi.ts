import { fetchApi, TApiFunction } from "@/app/api";
import type { TUpdate, TUpdateParams } from "@/app/api/auth/update";
import { EFormMethods } from "@/app/shared/enums";

export const updateApi: TApiFunction<TUpdateParams, TUpdate> = (params) => {
  return fetchApi<TUpdate>(`/api/v1/user/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
