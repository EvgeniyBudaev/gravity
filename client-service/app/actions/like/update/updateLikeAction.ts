"use server";

import { revalidatePath } from "next/cache";
import { updateLikeFormSchema } from "@/app/actions/like/update/schemas";
import { cancelLike } from "@/app/api/like/cancel";
import { updateLike } from "@/app/api/like/update";
import { ERoutes } from "@/app/shared/enums";
import type { TCommonResponseError } from "@/app/shared/types/error";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";

export async function updateLikeAction(prevState: any, formData: FormData) {
  const resolver = updateLikeFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return {
      data: undefined,
      error: undefined,
      errors: errors,
      success: false,
    };
  }

  const formattedParams = {
    ...resolver.data,
  };
  const isCancel = JSON.parse(formattedParams.isCancel);
  const paramsDto = {
    id: formattedParams.id,
    humanId: formattedParams.humanId,
  };
  try {
    const response = isCancel
      ? await cancelLike(paramsDto)
      : await updateLike(paramsDto);
    const path = createPath({
      route: ERoutes.Profile,
      params: { id: resolver?.data.humanId },
    });
    revalidatePath(path);
    return {
      data: response.data,
      error: undefined,
      errors: undefined,
      success: true,
    };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors } =
      getResponseError(responseData) ?? {};
    return {
      data: undefined,
      error: formError,
      errors: fieldErrors,
      success: false,
    };
  }
}
