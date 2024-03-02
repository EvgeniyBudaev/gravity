import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TAddComplaintParams,
  TAddComplaintResponse,
} from "@/app/api/complaint/add";
import { EFormMethods } from "@/app/shared/enums";

export const addComplaintApi: TApiFunction<
  TAddComplaintParams,
  TAddComplaintResponse
> = (params) => {
  return fetchApi<TAddComplaintResponse>(`/api/v1/complaint/add`, {
    method: EFormMethods.Post,
    body: params,
  });
};
