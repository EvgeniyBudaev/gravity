import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TEditProfileParams,
  TEditProfileResponse,
} from "@/app/api/profile/edit";
import { EFormMethods } from "@/app/shared/enums";

export const editProfileApi: TApiFunction<
  TEditProfileParams,
  TEditProfileResponse
> = (params) => {
  return fetchApi<TEditProfileResponse>(`/api/v1/profile/edit`, {
    method: EFormMethods.Post,
    body: params,
  });
};
