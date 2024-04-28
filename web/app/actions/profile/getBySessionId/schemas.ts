import { z } from "zod";
import { zfd } from "zod-form-data";
import { EFormFields } from "@/app/entities/login/loginForm/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const getProfileBySessionIdFormSchema = zfd.formData({
  [EFormFields.SessionId]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
