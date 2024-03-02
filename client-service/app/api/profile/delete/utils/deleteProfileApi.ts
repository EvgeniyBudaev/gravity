import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TDeleteProfileParams,
  TDeleteProfileResponse,
} from "@/app/api/profile/delete/types";
import { EFormMethods } from "@/app/shared/enums";

export const deleteProfileApi: TApiFunction<
  TDeleteProfileParams,
  TDeleteProfileResponse
> = (params) => {
  console.log("deleteProfileApi url");
  return fetchApi<TDeleteProfileResponse>(`/api/v1/profile/delete`, {
    method: EFormMethods.Post,
    body: params,
  });
};
