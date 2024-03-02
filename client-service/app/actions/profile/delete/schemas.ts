import { z } from "zod";
import { zfd } from "zod-form-data";
import { EFormFields } from "@/app/pages/profilePage/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const deleteProfileFormSchema = zfd.formData({
  [EFormFields.Id]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
