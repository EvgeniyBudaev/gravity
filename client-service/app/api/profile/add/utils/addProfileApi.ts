import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TAddProfileParams,
  TAddProfileResponse,
} from "@/app/api/profile/add/types";
import { EFormMethods } from "@/app/shared/enums";

export const addProfileApi: TApiFunction<
  TAddProfileParams,
  TAddProfileResponse
> = (params) => {
  return fetchApi<TAddProfileResponse>(`/api/v1/profile/add`, {
    method: EFormMethods.Post,
    body: params,
  });
};
