import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TDeleteReviewParams,
  TDeleteReviewResponse,
} from "@/app/api/review/delete";
import { EFormMethods } from "@/app/shared/enums";

export const deleteReviewApi: TApiFunction<
  TDeleteReviewParams,
  TDeleteReviewResponse
> = (params) => {
  return fetchApi<TDeleteReviewResponse>(`/api/v1/review/delete`, {
    method: EFormMethods.Post,
    body: params,
  });
};
