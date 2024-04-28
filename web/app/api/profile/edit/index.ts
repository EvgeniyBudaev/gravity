import { editProfile } from "./domain";
import { editProfileParamsSchema, editProfileResponseSchema } from "./schemas";
import type { TEditProfileParams, TEditProfileResponse } from "./types";

export {
  editProfile,
  editProfileParamsSchema,
  editProfileResponseSchema,
  type TEditProfileParams,
  type TEditProfileResponse,
};
