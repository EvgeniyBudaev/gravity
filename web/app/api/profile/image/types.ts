import type { z } from "zod";
import { imageSchema } from "@/app/api/profile/image/schemas";

export type TImage = z.infer<typeof imageSchema>;
