import { z } from "zod";
import { zfd } from "zod-form-data";
import { EComplaintFormFields } from "@/app/pages/profilePage/complaint/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const addComplaintFormSchema = zfd.formData({
  [EComplaintFormFields.SessionId]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EComplaintFormFields.ComplaintUserId]: z
    .string()
    .trim()
    .min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EComplaintFormFields.Reason]: z.string().trim(),
});
