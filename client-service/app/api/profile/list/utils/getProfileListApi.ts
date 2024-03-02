import { fetchApi, TApiFunction } from "@/app/api";
import type {
  TProfileListParams,
  TProfileListResponse,
} from "@/app/api/profile/list/types";
import { EFormMethods } from "@/app/shared/enums";

export const getProfileListApi: TApiFunction<
  TProfileListParams,
  TProfileListResponse
> = (params) => {
  const url = `/api/v1/profile/list?${new URLSearchParams(params)}`;
  return fetchApi<TProfileListResponse>(url, {
    method: EFormMethods.Get,
  });
};
