import { ELookingFor } from "@/app/shared/enums/form";
import { ELanguage } from "@/app/shared/enums";

const CHAT_MAPPING = {
  [ELanguage.Ru]: "Чат",
  [ELanguage.En]: "Chat",
};

const DATES_MAPPING = {
  [ELanguage.Ru]: "Свидания",
  [ELanguage.En]: "Dates",
};

const RELATIONSHIP_MAPPING = {
  [ELanguage.Ru]: "Отношения",
  [ELanguage.En]: "Relationship",
};

const FRIENDSHIP_MAPPING = {
  [ELanguage.Ru]: "Дружба",
  [ELanguage.En]: "Friendship",
};

const BUSINESS_MAPPING = {
  [ELanguage.Ru]: "Деловые связи",
  [ELanguage.En]: "Business connections",
};

const SEX_MAPPING = {
  [ELanguage.Ru]: "Секс",
  [ELanguage.En]: "Sex",
};

const ALL_MAPPING = {
  [ELanguage.Ru]: "Для всего",
  [ELanguage.En]: "For everything",
};

export const PROFILE_LOOKING_FOR_MAPPING = {
  [ELookingFor.Chat]: CHAT_MAPPING,
  [ELookingFor.Dates]: DATES_MAPPING,
  [ELookingFor.Relationship]: RELATIONSHIP_MAPPING,
  [ELookingFor.Friendship]: FRIENDSHIP_MAPPING,
  [ELookingFor.Business]: BUSINESS_MAPPING,
  [ELookingFor.Sex]: SEX_MAPPING,
  [ELookingFor.All]: ALL_MAPPING,
};
