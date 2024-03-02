"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { editProfileFormSchema } from "@/app/actions/profile/edit/schemas";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { editProfile, type TEditProfileParams } from "@/app/api/profile/edit";
import { mapUpdateToDto } from "@/app/api/profile/edit/utils";
import { EProfileEditFormFields } from "@/app/pages/profileEditPage/enums";
import { ERoutes } from "@/app/shared/enums";
import { ESearchGender } from "@/app/shared/enums/form";
import type { TCommonResponseError } from "@/app/shared/types/error";
import type { TSession } from "@/app/shared/types/session";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";
import { EProfileAddFormFields } from "@/app/pages/profileAddPage/enums";

export async function editProfileAction(prevState: any, formData: FormData) {
  const session = (await getServerSession(authOptions)) as TSession;
  if (!session) {
    return redirect(
      createPath({
        route: ERoutes.Login,
      }),
    );
  }

  const resolver = editProfileFormSchema.safeParse(
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
    const mapperParams = mapUpdateToDto(formattedParams);

    // Update user to keycloak (does not update username)
    // const userResponse = await update({...mapperParams.updateForm, id: session.user.id});
    // if (userResponse.success) {
    // }
    const profileFormData = new FormData();
    profileFormData.append(
      EProfileEditFormFields.Id,
      mapperParams.profileForm.id,
    );
    profileFormData.append("session", session?.user.id);
    profileFormData.append(
      EProfileEditFormFields.Username,
      mapperParams.profileForm.userName,
    );
    profileFormData.append(
      EProfileEditFormFields.DisplayName,
      mapperParams.profileForm.displayName,
    );
    profileFormData.append(
      EProfileEditFormFields.FirstName,
      mapperParams.profileForm?.firstName ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.LastName,
      mapperParams.profileForm?.lastName ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.Birthday,
      mapperParams.profileForm.birthday,
    );
    profileFormData.append(
      EProfileEditFormFields.Gender,
      mapperParams.profileForm.gender,
    );
    profileFormData.append(
      EProfileEditFormFields.SearchGender,
      mapperParams.profileForm?.searchGender ?? ESearchGender.All,
    );
    profileFormData.append(
      EProfileEditFormFields.Location,
      mapperParams.profileForm?.location ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.Description,
      mapperParams.profileForm?.description ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.Height,
      mapperParams.profileForm?.height ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.Weight,
      mapperParams.profileForm?.weight ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.LookingFor,
      mapperParams.profileForm?.lookingFor ?? "",
    );
    if (formData.getAll("image")?.length) {
      (formData.getAll("image") ?? []).forEach((item) => {
        profileFormData.append(EProfileAddFormFields.Image, item);
      });
    }
    profileFormData.append(
      EProfileEditFormFields.TelegramID,
      mapperParams.profileForm.telegramId,
    );
    profileFormData.append(
      EProfileEditFormFields.TelegramUsername,
      mapperParams.profileForm.telegramUserName,
    );
    profileFormData.append(
      EProfileEditFormFields.FirstName,
      mapperParams.profileForm?.firstName ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.LastName,
      mapperParams.profileForm?.lastName ?? "",
    );
    profileFormData.append(
      EProfileEditFormFields.LanguageCode,
      mapperParams.profileForm.languageCode,
    );
    profileFormData.append(
      EProfileEditFormFields.AllowsWriteToPm,
      mapperParams.profileForm.allowsWriteToPm,
    );
    profileFormData.append(
      EProfileEditFormFields.QueryId,
      mapperParams.profileForm.queryId,
    );
    profileFormData.append(
      EProfileEditFormFields.Latitude,
      mapperParams.profileForm.latitude,
    );
    profileFormData.append(
      EProfileEditFormFields.Longitude,
      mapperParams.profileForm.longitude,
    );
    profileFormData.append(
      EProfileEditFormFields.AgeFrom,
      mapperParams.profileForm.ageFrom,
    );
    profileFormData.append(
      EProfileEditFormFields.AgeTo,
      mapperParams.profileForm.ageTo,
    );
    profileFormData.append(
      EProfileEditFormFields.Distance,
      mapperParams.profileForm.distance,
    );
    profileFormData.append(
      EProfileEditFormFields.Page,
      mapperParams.profileForm.page,
    );
    profileFormData.append(
      EProfileEditFormFields.Size,
      mapperParams.profileForm.size,
    );

    const response = await editProfile(
      formData as unknown as TEditProfileParams,
    );
    const path = createPath({
      route: ERoutes.ProfileEdit,
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
