import { fetchApi, type TApiFunction } from "@/app/api";
import type { TAddBlockParams, TAddBlockResponse } from "@/app/api/block/add";
import { EFormMethods } from "@/app/shared/enums";

export const addBlockApi: TApiFunction<TAddBlockParams, TAddBlockResponse> = (
  params,
) => {
  return fetchApi<TAddBlockResponse>(`/api/v1/block/add`, {
    method: EFormMethods.Post,
    body: params,
  });
};
