import { z } from "zod";
import { zfd } from "zod-form-data";
import { EUpdateLikeFormFields } from "@/app/pages/profilePage/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const updateLikeFormSchema = zfd.formData({
  [EUpdateLikeFormFields.Id]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EUpdateLikeFormFields.IsCancel]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EUpdateLikeFormFields.HumanId]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
