"use server";

import { revalidatePath } from "next/cache";
import { useFormState } from "react-dom";
import { addReviewFormSchema } from "@/app/actions/review/add/schemas";
import { addReview, type TAddReviewParams } from "@/app/api/review/add";
import { ERoutes } from "@/app/shared/enums";
import type { TCommonResponseError } from "@/app/shared/types/error";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";

export async function addReviewAction(prevState: any, formData: FormData) {
  const resolver = addReviewFormSchema.safeParse(
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
    const response = await addReview(formData as unknown as TAddReviewParams);
    const path = createPath({
      route: ERoutes.ReviewAdd,
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
