"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  deleteReview,
  type TDeleteReviewParams,
} from "@/app/api/review/delete";
import { deleteReviewFormSchema } from "@/app/actions/review/delete/schemas";
import { ERoutes } from "@/app/shared/enums";
import type { TCommonResponseError } from "@/app/shared/types/error";
import type { TSession } from "@/app/shared/types/session";
import {
  getErrorsResolver,
  createPath,
  getResponseError,
} from "@/app/shared/utils";

export async function deleteReviewAction(prevState: any, formData: FormData) {
  const session = (await getServerSession(authOptions)) as TSession;
  if (!session) {
    return redirect(
      createPath({
        route: ERoutes.Login,
      }),
    );
  }

  const resolver = deleteReviewFormSchema.safeParse(
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
    const response = await deleteReview(
      formData as unknown as TDeleteReviewParams,
    );
    const path = createPath({
      route: ERoutes.Reviews,
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
