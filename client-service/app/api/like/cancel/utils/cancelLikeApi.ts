import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TCancelLikeParams,
  TCancelLikeResponse,
} from "@/app/api/like/cancel";
import { EFormMethods } from "@/app/shared/enums";

export const cancelLikeApi: TApiFunction<
  TCancelLikeParams,
  TCancelLikeResponse
> = (params) => {
  return fetchApi<TCancelLikeResponse>(`/api/v1/like/delete`, {
    method: EFormMethods.Post,
    body: params,
  });
};
