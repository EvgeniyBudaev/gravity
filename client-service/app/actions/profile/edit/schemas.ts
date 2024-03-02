import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { fileSchema, MAX_FILE_SIZE } from "@/app/api/upload";
import { EProfileEditFormFields } from "@/app/pages/profileEditPage/enums";
import { EGender, ELookingFor, ESearchGender } from "@/app/shared/enums/form";
import {
  EMPTY_FIELD_ERROR_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
  NAME_ERROR_MESSAGE,
  NAME_REGEXP,
} from "@/app/shared/validation";
import {
  // EMAIL_ERROR_MESSAGE,
  // EMAIL_NOT_CYRILLIC_ERROR_MESSAGE,
  // EMAIL_NOT_CYRILLIC_REGEXP,
  // EMAIL_REGEXP,
  PHONE_ERROR_MESSAGE,
  PHONE_REGEXP,
} from "@/app/shared/validation/constants";

export const editProfileFormSchema = zfd
  .formData({
    [EProfileEditFormFields.Id]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.DisplayName]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Username]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.MobileNumber]: z
      .string()
      .trim()
      .min(11, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Email]: z
      .string()
      .trim()
      // .regex(EMAIL_NOT_CYRILLIC_REGEXP, EMAIL_NOT_CYRILLIC_ERROR_MESSAGE)
      // .regex(EMAIL_REGEXP, EMAIL_ERROR_MESSAGE)
      .nullish(),
    [EProfileEditFormFields.Birthday]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Gender]: z
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
    [EProfileEditFormFields.SearchGender]: z
      .enum([ESearchGender.Man, ESearchGender.Woman, ESearchGender.All, ""])
      .nullish(),
    [EProfileEditFormFields.Location]: z.string().trim().nullish(),
    [EProfileEditFormFields.Description]: z.string().trim().nullish(),
    [EProfileEditFormFields.Height]: z.string().trim().nullish(),
    [EProfileEditFormFields.Weight]: z.string().trim().nullish(),
    [EProfileEditFormFields.LookingFor]: z
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
    [EProfileEditFormFields.IsDefaultImage]: z.string().trim().nullish(),
    [EProfileEditFormFields.Image]: z.union([
      z.literal(null),
      fileSchema.or(fileSchema.array()),
    ]),
    [EProfileEditFormFields.TelegramID]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.TelegramUsername]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.FirstName]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE)
      .regex(NAME_REGEXP, NAME_ERROR_MESSAGE),
    [EProfileEditFormFields.LastName]: z
      .string()
      .trim()
      .regex(NAME_REGEXP, NAME_ERROR_MESSAGE),
    [EProfileEditFormFields.LanguageCode]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.AllowsWriteToPm]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.QueryId]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Latitude]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Longitude]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.AgeFrom]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.AgeTo]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Distance]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Page]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EProfileEditFormFields.Size]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  })
  .refine(({ userName }) => PHONE_REGEXP.test(userName), {
    path: [EProfileEditFormFields.Username],
    message: PHONE_ERROR_MESSAGE,
  })
  .refine(({ mobileNumber }) => PHONE_REGEXP.test(mobileNumber), {
    path: [EProfileEditFormFields.MobileNumber],
    message: PHONE_ERROR_MESSAGE,
  })
  .superRefine(({ isDefaultImage, image }, ctx) => {
    if (
      Boolean(isDefaultImage) &&
      !isNil(image) &&
      !Array.isArray(image) &&
      image.size > MAX_FILE_SIZE
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [EProfileEditFormFields.Image],
        message: FILE_MAX_SIZE_MESSAGE,
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [EProfileEditFormFields.Image],
        message: EMPTY_FIELD_ERROR_MESSAGE,
      });
    }
    if (!Boolean(isDefaultImage) && isNil(image)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [EProfileEditFormFields.Image],
        message: EMPTY_FIELD_ERROR_MESSAGE,
      });
    }
    if (
      !Boolean(isDefaultImage) &&
      !isNil(image) &&
      !Array.isArray(image) &&
      image.size > MAX_FILE_SIZE
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [EProfileEditFormFields.Image],
        message: FILE_MAX_SIZE_MESSAGE,
      });
    }
  });
