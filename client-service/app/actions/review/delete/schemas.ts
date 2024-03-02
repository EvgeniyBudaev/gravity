import { z } from "zod";
import { zfd } from "zod-form-data";
import { EFormFields } from "@/app/pages/reviewsPage/reviewListItem/deleteReview/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "@/app/shared/validation";

export const deleteReviewFormSchema = zfd.formData({
  [EFormFields.Id]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
});
