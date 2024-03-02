import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TUpdateLikeParams,
  TUpdateLikeResponse,
} from "@/app/api/like/update";
import { EFormMethods } from "@/app/shared/enums";

export const updateLikeApi: TApiFunction<
  TUpdateLikeParams,
  TUpdateLikeResponse
> = (params) => {
  return fetchApi<TUpdateLikeResponse>(`/api/v1/like/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
