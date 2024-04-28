import { addComplaint } from "./domain";
import {
  addComplaintParamsSchema,
  addComplaintResponseSchema,
  complaintSchema,
} from "./schemas";
import type {
  TComplaint,
  TAddComplaintParams,
  TAddComplaintResponse,
} from "./types";

export {
  addComplaint,
  addComplaintParamsSchema,
  addComplaintResponseSchema,
  complaintSchema,
  type TComplaint,
  type TAddComplaintParams,
  type TAddComplaintResponse,
};
