import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TAddReviewParams,
  TAddReviewResponse,
} from "@/app/api/review/add";
import { EFormMethods } from "@/app/shared/enums";

export const addReviewApi: TApiFunction<
  TAddReviewParams,
  TAddReviewResponse
> = (params) => {
  return fetchApi<TAddReviewResponse>(`/api/v1/review/add`, {
    method: EFormMethods.Post,
    body: params,
  });
};
