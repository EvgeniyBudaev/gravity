import { ELookingFor } from "@/app/shared/enums/form";
import { ELanguage } from "@/app/shared/enums";

const lookingForOptionsRU = [
  { label: "Общение", value: ELookingFor.Chat },
  { label: "Свидания", value: ELookingFor.Dates },
  { label: "Отношения", value: ELookingFor.Relationship },
  { label: "Дружба", value: ELookingFor.Friendship },
  { label: "Деловые связи", value: ELookingFor.Business },
  { label: "Секс", value: ELookingFor.Sex },
  { label: "Для всего", value: ELookingFor.All },
];

const lookingForOptionsEN = [
  { label: "Communication", value: ELookingFor.Chat },
  { label: "Dates", value: ELookingFor.Dates },
  { label: "Relationship", value: ELookingFor.Relationship },
  { label: "Friendship", value: ELookingFor.Friendship },
  { label: "Business", value: ELookingFor.Business },
  { label: "Sex", value: ELookingFor.Sex },
  { label: "For everything", value: ELookingFor.All },
];

export const LOOKING_FOR_MAPPING = {
  [ELanguage.Ru]: lookingForOptionsRU,
  [ELanguage.En]: lookingForOptionsEN,
};
