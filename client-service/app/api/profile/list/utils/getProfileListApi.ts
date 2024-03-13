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
  const queryParams = {
    ...(params?.latitude && { latitude: params?.latitude }),
    ...(params?.longitude && { longitude: params?.longitude }),
  };
  const url = `/api/v1/profile/list?${new URLSearchParams(queryParams)}`;
  return fetchApi<TProfileListResponse>(url, {
    method: EFormMethods.Get,
  });
};
