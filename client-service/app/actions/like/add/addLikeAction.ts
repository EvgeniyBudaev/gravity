"use server";

import { revalidatePath } from "next/cache";
import { addLikeFormSchema } from "@/app/actions/like/add/schemas";
import { addLike } from "@/app/api/like/add";
import { ERoutes } from "@/app/shared/enums";
import type { TCommonResponseError } from "@/app/shared/types/error";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";

export async function addLikeAction(prevState: any, formData: FormData) {
  const resolver = addLikeFormSchema.safeParse(
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
  console.log("formattedParams: ", formattedParams);
  try {
    const response = await addLike(formattedParams);
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
