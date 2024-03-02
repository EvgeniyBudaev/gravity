import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { imageFileSchema } from "@/app/api/upload";
import { EProfileAddFormFields } from "@/app/pages/profileAddPage/enums";
import { EGender, ELookingFor, ESearchGender } from "@/app/shared/enums/form";
import {
  EMPTY_FIELD_ERROR_MESSAGE,
  NAME_ERROR_MESSAGE,
  NAME_REGEXP,
} from "@/app/shared/validation";
import {
  // EMAIL_ERROR_MESSAGE,
  // EMAIL_NOT_CYRILLIC_ERROR_MESSAGE,
  // EMAIL_NOT_CYRILLIC_REGEXP,
  // EMAIL_REGEXP,
  PASSWORD_ERROR_MESSAGE,
  PHONE_ERROR_MESSAGE,
  PHONE_REGEXP,
} from "@/app/shared/validation/constants";

export const addProfileFormSchema = zfd
  .formData({
    [EProfileAddFormFields.DisplayName]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Username]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.MobileNumber]: z
      .string()
      .trim()
      .min(11, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Email]: z
      .string()
      .trim()
      // .regex(EMAIL_NOT_CYRILLIC_REGEXP, EMAIL_NOT_CYRILLIC_ERROR_MESSAGE)
      // .regex(EMAIL_REGEXP, EMAIL_ERROR_MESSAGE)
      .nullish(),
    [EProfileAddFormFields.Birthday]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Gender]: z
      .enum([EGender.Man, EGender.Woman, ""])
      .transform((value) => {
        return isEmpty(value) || isNil(value) ? "" : value;
      })
      .refine(
        (value) => {
          return !isNil(value) && !isEmpty(value);
        },
        {
          message: EMPTY_FIELD_ERROR_MESSAGE,
        },
      ),
    [EProfileAddFormFields.SearchGender]: z
      .enum([ESearchGender.Man, ESearchGender.Woman, ESearchGender.All, ""])
      .nullish(),
    [EProfileAddFormFields.Location]: z.string().trim().nullish(),
    [EProfileAddFormFields.Description]: z.string().trim().nullish(),
    [EProfileAddFormFields.Height]: z.string().trim().nullish(),
    [EProfileAddFormFields.Weight]: z.string().trim().nullish(),
    [EProfileAddFormFields.LookingFor]: z
      .enum([
        ELookingFor.Chat,
        ELookingFor.Dates,
        ELookingFor.Relationship,
        ELookingFor.Friendship,
        ELookingFor.Business,
        ELookingFor.Sex,
        ELookingFor.All,
        "",
      ])
      .nullish(),
    [EProfileAddFormFields.Image]: imageFileSchema,
    [EProfileAddFormFields.TelegramID]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.TelegramUsername]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.FirstName]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE)
      .regex(NAME_REGEXP, NAME_ERROR_MESSAGE),
    [EProfileAddFormFields.LastName]: z
      .string()
      .trim()
      .regex(NAME_REGEXP, NAME_ERROR_MESSAGE),
    [EProfileAddFormFields.LanguageCode]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.AllowsWriteToPm]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.QueryId]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Latitude]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Longitude]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.AgeFrom]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.AgeTo]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Distance]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Page]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Size]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.Password]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileAddFormFields.PasswordConfirm]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: [EProfileAddFormFields.PasswordConfirm],
    message: PASSWORD_ERROR_MESSAGE,
  })
  .refine(({ userName }) => PHONE_REGEXP.test(userName), {
    path: [EProfileAddFormFields.Username],
    message: PHONE_ERROR_MESSAGE,
  })
  .refine(({ mobileNumber }) => PHONE_REGEXP.test(mobileNumber), {
    path: [EProfileAddFormFields.MobileNumber],
    message: PHONE_ERROR_MESSAGE,
  });
