import { fetchApi, type TApiFunction } from "@/app/api";
import type { TAddLikeParams, TAddLikeResponse } from "@/app/api/like/add";
import { EFormMethods } from "@/app/shared/enums";

export const addLikeApi: TApiFunction<TAddLikeParams, TAddLikeResponse> = (
  params,
) => {
  return fetchApi<TAddLikeResponse>(`/api/v1/like/add`, {
    method: EFormMethods.Post,
    body: params,
  });
};
