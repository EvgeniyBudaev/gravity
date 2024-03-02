import { DEFAULT_LANGUAGE } from "@/app/shared/constants/language";

export const fallbackLng = DEFAULT_LANGUAGE;
export const languages = [fallbackLng, "en"];
export const cookieName = "i18next";
export const defaultNS = "index";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
