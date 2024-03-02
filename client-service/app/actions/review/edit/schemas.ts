import { z } from "zod";
import { zfd } from "zod-form-data";
import { EFormFields } from "@/app/pages/reviewEditPage/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const editReviewFormSchema = zfd
  .formData({
    [EFormFields.Id]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EFormFields.ProfileId]: z
      .string()
      .trim()
      .min(1, EMPTY_FIELD_ERROR_MESSAGE),
    [EFormFields.Message]: z.string().trim().nullish(),
    [EFormFields.Rating]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  })
  .refine(({ rating }) => Number(rating) !== 0, {
    path: [EFormFields.Rating],
    message: EMPTY_FIELD_ERROR_MESSAGE,
  });
