import { fetchApi, type TApiFunction } from "@/app/api";
import type {
  TDeleteImageParams,
  TDeleteImageResponse,
} from "@/app/api/profile/image/delete";
import { EFormMethods } from "@/app/shared/enums";

export const deleteImageApi: TApiFunction<
  TDeleteImageParams,
  TDeleteImageResponse
> = (params) => {
  console.log("deleteImageApi url");
  return fetchApi<TDeleteImageResponse>(`/api/v1/profile/image/delete`, {
    method: EFormMethods.Post,
    body: params,
  });
};
