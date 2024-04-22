import { EProfileEditFormFields } from "@/app/pages/profileEditPage/enums";
import { TFile } from "@/app/shared/types/file";

type TProps = {
  [EProfileEditFormFields.Id]: string;
  [EProfileEditFormFields.Username]: string;
  [EProfileEditFormFields.DisplayName]: string;
  [EProfileEditFormFields.Email]: string;
  [EProfileEditFormFields.MobileNumber]: string;
  [EProfileEditFormFields.Birthday]: string;
  [EProfileEditFormFields.Gender]: string;
  [EProfileEditFormFields.SearchGender]?: string | null | undefined;
  [EProfileEditFormFields.Location]?: string | null | undefined;
  [EProfileEditFormFields.Description]?: string | null | undefined;
  [EProfileEditFormFields.Height]?: string | null | undefined;
  [EProfileEditFormFields.Weight]?: string | null | undefined;
  [EProfileEditFormFields.LookingFor]?: string | null | undefined;
  [EProfileEditFormFields.Image]?: TFile | TFile[] | null | undefined;
  [EProfileEditFormFields.TelegramID]: string;
  [EProfileEditFormFields.TelegramUsername]: string;
  [EProfileEditFormFields.FirstName]: string;
  [EProfileEditFormFields.LastName]: string;
  [EProfileEditFormFields.LanguageCode]: string;
  [EProfileEditFormFields.AllowsWriteToPm]: string;
  [EProfileEditFormFields.QueryId]: string;
  [EProfileEditFormFields.ChatId]: string;
  [EProfileEditFormFields.Latitude]: string;
  [EProfileEditFormFields.Longitude]: string;
  [EProfileEditFormFields.AgeFrom]: string;
  [EProfileEditFormFields.AgeTo]: string;
  [EProfileEditFormFields.Distance]: string;
  [EProfileEditFormFields.Page]: string;
  [EProfileEditFormFields.Size]: string;
};

type TUpdateForm = {
  [EProfileEditFormFields.Email]: string;
  [EProfileEditFormFields.MobileNumber]: string;
  [EProfileEditFormFields.Username]: string;
  [EProfileEditFormFields.FirstName]: string;
  [EProfileEditFormFields.LastName]: string;
};

type TProfileForm = {
  [EProfileEditFormFields.Id]: string;
  [EProfileEditFormFields.Username]: string;
  [EProfileEditFormFields.DisplayName]: string;
  [EProfileEditFormFields.Birthday]: string;
  [EProfileEditFormFields.Gender]: string;
  [EProfileEditFormFields.SearchGender]?: string | null | undefined;
  [EProfileEditFormFields.Location]?: string | null | undefined;
  [EProfileEditFormFields.Description]?: string | null | undefined;
  [EProfileEditFormFields.Height]?: string | null | undefined;
  [EProfileEditFormFields.Weight]?: string | null | undefined;
  [EProfileEditFormFields.LookingFor]?: string | null | undefined;
  [EProfileEditFormFields.Image]?: TFile | TFile[] | null | undefined;
  [EProfileEditFormFields.TelegramID]: string;
  [EProfileEditFormFields.TelegramUsername]: string;
  [EProfileEditFormFields.FirstName]: string;
  [EProfileEditFormFields.LastName]: string;
  [EProfileEditFormFields.LanguageCode]: string;
  [EProfileEditFormFields.AllowsWriteToPm]: string;
  [EProfileEditFormFields.QueryId]: string;
  [EProfileEditFormFields.ChatId]: string;
  [EProfileEditFormFields.Latitude]: string;
  [EProfileEditFormFields.Longitude]: string;
  [EProfileEditFormFields.AgeFrom]: string;
  [EProfileEditFormFields.AgeTo]: string;
  [EProfileEditFormFields.Distance]: string;
  [EProfileEditFormFields.Page]: string;
  [EProfileEditFormFields.Size]: string;
};

type TResponse = {
  profileForm: TProfileForm;
  updateForm: TUpdateForm;
};

type TMapUpdateToDto = (props: TProps) => TResponse;

export const mapUpdateToDto: TMapUpdateToDto = (props) => {
  return {
    profileForm: {
      [EProfileEditFormFields.Id]: props.id,
      [EProfileEditFormFields.Username]: props.userName,
      [EProfileEditFormFields.DisplayName]: props.displayName,
      [EProfileEditFormFields.Birthday]: props.birthday,
      [EProfileEditFormFields.Gender]: props.gender,
      [EProfileEditFormFields.SearchGender]: props?.searchGender ?? "",
      [EProfileEditFormFields.Location]: props?.location ?? "",
      [EProfileEditFormFields.Description]: props?.description ?? "",
      [EProfileEditFormFields.Height]: props?.height ?? "0",
      [EProfileEditFormFields.Weight]: props?.weight ?? "0",
      [EProfileEditFormFields.LookingFor]: props?.lookingFor ?? "",
      [EProfileEditFormFields.Image]: props?.image ?? null,
      [EProfileEditFormFields.TelegramID]: props.telegramId,
      [EProfileEditFormFields.TelegramUsername]: props.telegramUserName,
      [EProfileEditFormFields.FirstName]: props.firstName,
      [EProfileEditFormFields.LastName]: props.lastName,
      [EProfileEditFormFields.LanguageCode]: props.languageCode,
      [EProfileEditFormFields.AllowsWriteToPm]: props.allowsWriteToPm,
      [EProfileEditFormFields.QueryId]: props.queryId,
      [EProfileEditFormFields.ChatId]: props.chatId,
      [EProfileEditFormFields.Latitude]: props.latitude,
      [EProfileEditFormFields.Longitude]: props.longitude,
      [EProfileEditFormFields.AgeFrom]: props.ageFrom,
      [EProfileEditFormFields.AgeTo]: props.ageTo,
      [EProfileEditFormFields.Distance]: props.distance,
      [EProfileEditFormFields.Page]: props.page,
      [EProfileEditFormFields.Size]: props.size,
    },
    updateForm: {
      [EProfileEditFormFields.Email]: props.email,
      [EProfileEditFormFields.MobileNumber]: props.mobileNumber,
      [EProfileEditFormFields.Username]: props.userName,
      [EProfileEditFormFields.FirstName]: props.firstName,
      [EProfileEditFormFields.LastName]: props.lastName,
    },
  };
};
