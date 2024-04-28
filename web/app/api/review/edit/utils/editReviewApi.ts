import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TEditReviewParams,
  TEditReviewResponse,
} from "@/app/api/review/edit";
import { EFormMethods } from "@/app/shared/enums";

export const editReviewApi: TApiFunction<
  TEditReviewParams,
  TEditReviewResponse
> = (params) => {
  return fetchApi<TEditReviewResponse>(`/api/v1/review/update`, {
    method: EFormMethods.Post,
    body: params,
  });
};
