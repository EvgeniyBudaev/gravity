import { enUS, ru } from "date-fns/locale";
import { ELanguage } from "@/app/shared/enums";

export const LANGUAGE_MAPPING = {
  [ELanguage.Ru]: ru,
  [ELanguage.En]: enUS,
};
