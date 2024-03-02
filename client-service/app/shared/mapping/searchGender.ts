import { ESearchGender } from "@/app/shared/enums/form";
import { ELanguage } from "@/app/shared/enums";

const searchGenderOptionsRU = [
  { label: "Парня", value: ESearchGender.Man },
  { label: "Девушку", value: ESearchGender.Woman },
  { label: "Всех", value: ESearchGender.All },
];

const searchGenderOptionsEN = [
  { label: "Boy", value: ESearchGender.Man },
  { label: "Girl", value: ESearchGender.Woman },
  { label: "All", value: ESearchGender.All },
];

export const SEARCH_GENDER_MAPPING = {
  [ELanguage.Ru]: searchGenderOptionsRU,
  [ELanguage.En]: searchGenderOptionsEN,
};

const searchBarSearchGenderOptionsRU = [
  { label: "Парни поблизости", value: ESearchGender.Man },
  { label: "Девушки поблизости", value: ESearchGender.Woman },
  { label: "Все люди поблизости", value: ESearchGender.All },
];

const searchBarSearchGenderOptionsEN = [
  { label: "Guys nearby", value: ESearchGender.Man },
  { label: "Girls nearby", value: ESearchGender.Woman },
  { label: "All the people nearby", value: ESearchGender.All },
];

export const SEARCH_BAR_SEARCH_GENDER_MAPPING = {
  [ELanguage.Ru]: searchBarSearchGenderOptionsRU,
  [ELanguage.En]: searchBarSearchGenderOptionsEN,
};
