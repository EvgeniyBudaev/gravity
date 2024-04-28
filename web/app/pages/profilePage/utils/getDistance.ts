import { TFunction } from "i18next";

export const getDistance = (
  value: number,
  t: TFunction<string, string>,
): string => {
  if (value >= 1000) {
    return `${Math.round(value / 1000)} ${t("common.reductions.km")}`;
  } else if (value < 100) {
    return `${100} ${t("common.reductions.m")}`;
  } else {
    return `${Math.round(value / 100) * 100} ${t("common.reductions.m")}`;
  }
};
