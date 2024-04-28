"use server";

import { revalidatePath } from "next/cache";
import { getProfileBySessionIdFormSchema } from "@/app/actions/profile/getBySessionId/schemas";
import { getProfileBySessionId } from "@/app/api/profile/getBySessionId";
import type { TCommonResponseError } from "@/app/shared/types/error";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";

export async function getProfileBySessionIdAction(
  prevState: any,
  formData: FormData,
) {
  const resolver = getProfileBySessionIdFormSchema.safeParse(
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

  try {
    const formattedParams = {
      ...resolver.data,
    };

    const response = await getProfileBySessionId(formattedParams);
    // const path = createPath({
    //   route: ERoutes.ProfileEdit,
    //   params: { id: resolver.data.id },
    // });
    // revalidatePath(path);
    return {
      data: response.data,
      error: undefined,
      errors: undefined,
      success: true,
    };
    // return {
    //   data: undefined,
    //   errorUI: undefined,
    //   errors: undefined,
    //   success: true,
    // };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors } =
      getResponseError(responseData) ?? {};
    console.log("[formError] ", formError);
    console.log("[fieldErrors] ", fieldErrors);
    return {
      data: undefined,
      error: formError,
      errors: fieldErrors,
      success: false,
    };
  }
}
