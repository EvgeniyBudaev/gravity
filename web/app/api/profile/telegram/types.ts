import type { z } from "zod";
import { telegramSchema } from "@/app/api/profile/telegram/schemas";

export type TTelegram = z.infer<typeof telegramSchema>;
