import { deleteImage } from "./domain";
import { deleteImageParamsSchema, deleteImageResponseSchema } from "./schemas";
import type { TDeleteImageParams, TDeleteImageResponse } from "./types";

export {
  deleteImage,
  deleteImageParamsSchema,
  deleteImageResponseSchema,
  type TDeleteImageParams,
  type TDeleteImageResponse,
};
