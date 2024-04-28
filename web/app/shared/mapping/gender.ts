import { EGender } from "@/app/shared/enums/form";
import { ELanguage } from "@/app/shared/enums";

const genderOptionsRU = [
  { label: "Мужской", value: EGender.Man },
  { label: "Женский", value: EGender.Woman },
];

const genderOptionsEN = [
  { label: "Man", value: EGender.Man },
  { label: "Woman", value: EGender.Woman },
];

export const GENDER_MAPPING = {
  [ELanguage.Ru]: genderOptionsRU,
  [ELanguage.En]: genderOptionsEN,
};
