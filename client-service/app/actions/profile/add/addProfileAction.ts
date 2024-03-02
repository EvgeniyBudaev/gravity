"use server";

import { revalidatePath } from "next/cache";
import { addProfileFormSchema } from "@/app/actions/profile/add/schemas";
import { addProfile, type TAddProfileParams } from "@/app/api/profile/add";
import { mapSignupToDto } from "@/app/api/auth/signup/utils/mapSignupToDto";
import { signup } from "@/app/api/auth/signup";
import { EProfileAddFormFields } from "@/app/pages/profileAddPage/enums";
import { ERoutes } from "@/app/shared/enums";
import { ESearchGender } from "@/app/shared/enums/form";
import type { TCommonResponseError } from "@/app/shared/types/error";
import {
  getResponseError,
  getErrorsResolver,
  createPath,
} from "@/app/shared/utils";

export async function addProfileAction(prevState: any, formData: FormData) {
  const resolver = addProfileFormSchema.safeParse(
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
    // console.log("formattedParams: ", formattedParams);
    const mapperParams = mapSignupToDto(formattedParams);
    const userResponse = await signup(mapperParams.signupForm);

    if (userResponse.success) {
      const profileFormData = new FormData();
      profileFormData.append("sessionId", userResponse.data.id);
      profileFormData.append(
        EProfileAddFormFields.Username,
        mapperParams.profileForm.userName,
      );
      profileFormData.append(
        EProfileAddFormFields.DisplayName,
        mapperParams.profileForm.displayName,
      );
      profileFormData.append(
        EProfileAddFormFields.FirstName,
        mapperParams.profileForm?.firstName ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.LastName,
        mapperParams.profileForm?.lastName ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.Birthday,
        mapperParams.profileForm.birthday,
      );
      profileFormData.append(
        EProfileAddFormFields.Gender,
        mapperParams.profileForm.gender,
      );
      profileFormData.append(
        EProfileAddFormFields.SearchGender,
        mapperParams.profileForm?.searchGender ?? ESearchGender.All,
      );
      profileFormData.append(
        EProfileAddFormFields.Location,
        mapperParams.profileForm?.location ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.Description,
        mapperParams.profileForm?.description ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.Height,
        mapperParams.profileForm?.height ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.Weight,
        mapperParams.profileForm?.weight ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.LookingFor,
        mapperParams.profileForm?.lookingFor ?? "",
      );
      if (formData.getAll("image")?.length) {
        (formData.getAll("image") ?? []).forEach((item) => {
          profileFormData.append(EProfileAddFormFields.Image, item);
        });
      }
      profileFormData.append(
        EProfileAddFormFields.TelegramID,
        mapperParams.profileForm.telegramId,
      );
      profileFormData.append(
        EProfileAddFormFields.TelegramUsername,
        mapperParams.profileForm.telegramUserName,
      );
      profileFormData.append(
        EProfileAddFormFields.FirstName,
        mapperParams.profileForm?.firstName ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.LastName,
        mapperParams.profileForm?.lastName ?? "",
      );
      profileFormData.append(
        EProfileAddFormFields.LanguageCode,
        mapperParams.profileForm.languageCode,
      );
      profileFormData.append(
        EProfileAddFormFields.AllowsWriteToPm,
        mapperParams.profileForm.allowsWriteToPm,
      );
      profileFormData.append(
        EProfileAddFormFields.QueryId,
        mapperParams.profileForm.queryId,
      );
      profileFormData.append(
        EProfileAddFormFields.Latitude,
        mapperParams.profileForm.latitude,
      );
      profileFormData.append(
        EProfileAddFormFields.Longitude,
        mapperParams.profileForm.longitude,
      );
      profileFormData.append(
        EProfileAddFormFields.AgeFrom,
        mapperParams.profileForm.ageFrom,
      );
      profileFormData.append(
        EProfileAddFormFields.AgeTo,
        mapperParams.profileForm.ageTo,
      );
      profileFormData.append(
        EProfileAddFormFields.Distance,
        mapperParams.profileForm.distance,
      );
      profileFormData.append(
        EProfileAddFormFields.Page,
        mapperParams.profileForm.page,
      );
      profileFormData.append(
        EProfileAddFormFields.Size,
        mapperParams.profileForm.size,
      );

      const response = await addProfile(
        profileFormData as unknown as TAddProfileParams,
      );

      const path = createPath({
        route: ERoutes.ProfileAdd,
      });
      revalidatePath(path);
      return {
        data: response.data,
        error: undefined,
        errors: undefined,
        success: true,
      };
    }

    return {
      data: undefined,
      errorUI: undefined,
      errors: undefined,
      success: false,
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
