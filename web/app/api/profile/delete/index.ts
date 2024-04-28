import { deleteProfile } from "./domain";
import {
  deleteProfileParamsSchema,
  deleteProfileResponseSchema,
} from "./schemas";
import type { TDeleteProfileParams, TDeleteProfileResponse } from "./types";

export {
  deleteProfile,
  deleteProfileParamsSchema,
  deleteProfileResponseSchema,
  type TDeleteProfileParams,
  type TDeleteProfileResponse,
};
