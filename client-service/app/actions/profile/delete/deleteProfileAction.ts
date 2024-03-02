"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { deleteProfileFormSchema } from "@/app/actions/profile/delete/schemas";
import { deleteUser } from "@/app/api/auth/delete";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  deleteProfile,
  type TDeleteProfileParams,
} from "@/app/api/profile/delete";
import { ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { getErrorsResolver, createPath } from "@/app/shared/utils";

export async function deleteProfileAction(prevState: any, formData: FormData) {
  const session = (await getServerSession(authOptions)) as TSession;
  if (!session) {
    return redirect(
      createPath({
        route: ERoutes.Login,
      }),
    );
  }

  const resolver = deleteProfileFormSchema.safeParse(
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

  const userResponse = await deleteUser({ id: session.user.id });

  if (userResponse) {
    const response = await deleteProfile(
      formData as unknown as TDeleteProfileParams,
    );
    if (response.success) {
      const path = createPath({
        route: ERoutes.Logout,
      });
      redirect(path);
    }
  }
  return {
    data: undefined,
    error: undefined,
    errors: undefined,
    success: true,
  };
}
