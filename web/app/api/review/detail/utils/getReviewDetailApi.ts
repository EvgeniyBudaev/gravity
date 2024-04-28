import { fetchApi, TApiFunction } from "@/app/api";
import type {
  TReviewDetailParams,
  TReviewDetailResponse,
} from "@/app/api/review/detail";
import { EFormMethods } from "@/app/shared/enums";

export const getReviewDetailApi: TApiFunction<
  TReviewDetailParams,
  TReviewDetailResponse
> = (params) => {
  const { id } = params;
  const url = `/api/v1/review/detail/${id}`;
  return fetchApi<TReviewDetailResponse>(url, {
    method: EFormMethods.Get,
  });
};
