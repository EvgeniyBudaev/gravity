import { z } from "zod";
import { zfd } from "zod-form-data";
import { EBlockFormFields } from "@/app/pages/profilePage/block/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const addBlockFormSchema = zfd.formData({
  [EBlockFormFields.SessionId]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EBlockFormFields.BlockedUserId]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
