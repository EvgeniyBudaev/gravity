import { z } from "zod";
import { zfd } from "zod-form-data";
import { EFormFields } from "@/app/shared/components/form/fileUploader/previews/imageList/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const deleteImageFormSchema = zfd.formData({
  [EFormFields.Id]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.ProfileId]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Latitude]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Longitude]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
