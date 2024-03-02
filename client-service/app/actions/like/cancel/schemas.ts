import { z } from "zod";
import { zfd } from "zod-form-data";
import { ECancelLikeFormFields } from "@/app/pages/profilePage/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const cancelLikeFormSchema = zfd.formData({
  [ECancelLikeFormFields.Id]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [ECancelLikeFormFields.IsCancel]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [ECancelLikeFormFields.HumanId]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
