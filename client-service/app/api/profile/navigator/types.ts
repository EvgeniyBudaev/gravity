import type { z } from "zod";
import { navigatorSchema } from "@/app/api/profile/navigator";

export type TNavigator = z.infer<typeof navigatorSchema>;
