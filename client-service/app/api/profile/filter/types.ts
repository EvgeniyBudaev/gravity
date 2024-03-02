import type { z } from "zod";
import { filterSchema } from "@/app/api/profile/filter/schemas";

export type TFilter = z.infer<typeof filterSchema>;
