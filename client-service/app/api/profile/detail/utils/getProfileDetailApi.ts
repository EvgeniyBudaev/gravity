import { fetchApi, TApiFunction } from "@/app/api";
import type {
  TProfileDetailParams,
  TProfileDetailResponse,
} from "@/app/api/profile/detail/types";
import { EFormMethods } from "@/app/shared/enums";

export const getProfileDetailApi: TApiFunction<
  TProfileDetailParams,
  TProfileDetailResponse
> = (params) => {
  const { id } = params;
  const queryParams = {
    ...(params?.viewerId && { viewerId: params?.viewerId }),
    ...(params?.latitude && { latitude: params?.latitude }),
    ...(params?.longitude && { longitude: params?.longitude }),
  };
  const url = `/api/v1/profile/detail/${id}?${new URLSearchParams(queryParams)}`;
  return fetchApi<TProfileDetailResponse>(url, {
    method: EFormMethods.Get,
  });
};
