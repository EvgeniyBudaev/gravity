import { fetchApi, TApiFunction } from "@/app/api";
import type {
  TReviewListParams,
  TReviewListResponse,
} from "@/app/api/review/list/types";
import { EFormMethods } from "@/app/shared/enums";

export const getReviewListApi: TApiFunction<
  TReviewListParams,
  TReviewListResponse
> = (params) => {
  const url = `/api/v1/review/list?${new URLSearchParams(params)}`;
  return fetchApi<TReviewListResponse>(url, {
    method: EFormMethods.Get,
  });
};
