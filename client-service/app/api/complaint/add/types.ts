import type { z } from "zod";
import {
  addComplaintParamsSchema,
  addComplaintResponseSchema,
  complaintSchema,
} from "@/app/api/complaint/add/schemas";

export type TComplaint = z.infer<typeof complaintSchema>;
export type TAddComplaintParams = z.infer<typeof addComplaintParamsSchema>;
export type TAddComplaintResponse = z.infer<typeof addComplaintResponseSchema>;
