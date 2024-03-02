import { addLike } from "./domain";
import {
  addLikeParamsSchema,
  likeSchema,
  addLikeResponseSchema,
} from "./schemas";
import type { TLike, TAddLikeParams, TAddLikeResponse } from "./types";

export {
  addLike,
  addLikeParamsSchema,
  likeSchema,
  addLikeResponseSchema,
  type TLike,
  type TAddLikeParams,
  type TAddLikeResponse,
};
