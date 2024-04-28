import { fetchApi, TApiFunction } from "@/app/api";
import type {
  TProfileBySessionIdParams,
  TProfileBySessionIdResponse,
} from "@/app/api/profile/getBySessionId/types";
import { EFormMethods } from "@/app/shared/enums";

export const getProfileBySessionIdApi: TApiFunction<
  TProfileBySessionIdParams,
  TProfileBySessionIdResponse
> = (params) => {
  const { sessionId } = params;
  const queryParams = {
    ...(params?.latitude && { latitude: params?.latitude }),
    ...(params?.longitude && { longitude: params?.longitude }),
  };
  const url = `/api/v1/profile/session/${sessionId}?${new URLSearchParams(queryParams)}`;
  return fetchApi<TProfileBySessionIdResponse>(url, {
    method: EFormMethods.Get,
  });
};
