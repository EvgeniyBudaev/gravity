"use server";

import { revalidatePath } from "next/cache";
import { editReviewFormSchema } from "@/app/actions/review/edit/schemas";
import { editReview, type TEditReviewParams } from "@/app/api/review/edit";
import { ERoutes } from "@/app/shared/enums";
import type { TCommonResponseError } from "@/app/shared/types/error";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";

export async function editReviewAction(prevState: any, formData: FormData) {
  const resolver = editReviewFormSchema.safeParse(
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
    const response = await editReview(formData as unknown as TEditReviewParams);
    const path = createPath({
      route: ERoutes.ReviewEdit,
      params: { id: resolver.data.id },
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
