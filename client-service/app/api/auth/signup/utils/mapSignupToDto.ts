import { EProfileAddFormFields } from "@/app/pages/profileAddPage/enums";
import { TFile } from "@/app/shared/types/file";

type TProps = {
  [EProfileAddFormFields.Username]: string;
  [EProfileAddFormFields.DisplayName]: string;
  [EProfileAddFormFields.Email]: string | null | undefined;
  [EProfileAddFormFields.MobileNumber]: string;
  [EProfileAddFormFields.Password]: string;
  [EProfileAddFormFields.PasswordConfirm]: string;
  [EProfileAddFormFields.Birthday]: string;
  [EProfileAddFormFields.Gender]: string;
  [EProfileAddFormFields.SearchGender]: string;
  [EProfileAddFormFields.Location]: string | null | undefined;
  [EProfileAddFormFields.Description]?: string | null;
  [EProfileAddFormFields.Height]: string | null | undefined;
  [EProfileAddFormFields.Weight]: string | null | undefined;
  [EProfileAddFormFields.LookingFor]: string;
  [EProfileAddFormFields.Image]: TFile | TFile[];
  [EProfileAddFormFields.TelegramID]: string;
  [EProfileAddFormFields.TelegramUsername]: string;
  [EProfileAddFormFields.FirstName]: string | null | undefined;
  [EProfileAddFormFields.LastName]: string | null | undefined;
  [EProfileAddFormFields.LanguageCode]: string;
  [EProfileAddFormFields.AllowsWriteToPm]: string;
  [EProfileAddFormFields.QueryId]: string;
  [EProfileAddFormFields.ChatId]: string;
  [EProfileAddFormFields.Latitude]: string;
  [EProfileAddFormFields.Longitude]: string;
  [EProfileAddFormFields.AgeFrom]: string;
  [EProfileAddFormFields.AgeTo]: string;
  [EProfileAddFormFields.Distance]: string;
  [EProfileAddFormFields.Page]: string;
  [EProfileAddFormFields.Size]: string;
};

type TSignupForm = {
  [EProfileAddFormFields.Email]: string | null | undefined;
  [EProfileAddFormFields.MobileNumber]: string;
  [EProfileAddFormFields.Password]: string;
  [EProfileAddFormFields.Username]: string;
  [EProfileAddFormFields.FirstName]: string | null | undefined;
  [EProfileAddFormFields.LastName]: string | null | undefined;
};

type TProfileForm = {
  [EProfileAddFormFields.Username]: string;
  [EProfileAddFormFields.DisplayName]: string;
  [EProfileAddFormFields.Birthday]: string;
  [EProfileAddFormFields.Gender]: string;
  [EProfileAddFormFields.SearchGender]: string;
  [EProfileAddFormFields.Location]: string | null | undefined;
  [EProfileAddFormFields.Description]: string | null | undefined;
  [EProfileAddFormFields.Height]: string | null | undefined;
  [EProfileAddFormFields.Weight]: string | null | undefined;
  [EProfileAddFormFields.LookingFor]: string;
  [EProfileAddFormFields.Image]: TFile | TFile[];
  [EProfileAddFormFields.TelegramID]: string;
  [EProfileAddFormFields.TelegramUsername]: string;
  [EProfileAddFormFields.FirstName]: string | null | undefined;
  [EProfileAddFormFields.LastName]: string | null | undefined;
  [EProfileAddFormFields.LanguageCode]: string;
  [EProfileAddFormFields.AllowsWriteToPm]: string;
  [EProfileAddFormFields.QueryId]: string;
  [EProfileAddFormFields.ChatId]: string;
  [EProfileAddFormFields.Latitude]: string;
  [EProfileAddFormFields.Longitude]: string;
  [EProfileAddFormFields.AgeFrom]: string;
  [EProfileAddFormFields.AgeTo]: string;
  [EProfileAddFormFields.Distance]: string;
  [EProfileAddFormFields.Page]: string;
  [EProfileAddFormFields.Size]: string;
};

type TResponse = {
  profileForm: TProfileForm;
  signupForm: TSignupForm;
};

type TMapSignupToDto = (props: TProps) => TResponse;

export const mapSignupToDto: TMapSignupToDto = (props: TProps) => {
  return {
    profileForm: {
      [EProfileAddFormFields.Username]: props.userName,
      [EProfileAddFormFields.DisplayName]: props.displayName,
      [EProfileAddFormFields.Birthday]: props.birthday,
      [EProfileAddFormFields.Gender]: props.gender,
      [EProfileAddFormFields.SearchGender]: props.searchGender,
      [EProfileAddFormFields.Location]: props.location,
      [EProfileAddFormFields.Description]: props.description,
      [EProfileAddFormFields.Height]: props.height,
      [EProfileAddFormFields.Weight]: props.weight,
      [EProfileAddFormFields.LookingFor]: props.lookingFor,
      [EProfileAddFormFields.Image]: props.image,
      [EProfileAddFormFields.TelegramID]: props.telegramId,
      [EProfileAddFormFields.TelegramUsername]: props.telegramUserName,
      [EProfileAddFormFields.FirstName]: props.firstName,
      [EProfileAddFormFields.LastName]: props.lastName,
      [EProfileAddFormFields.LanguageCode]: props.languageCode,
      [EProfileAddFormFields.AllowsWriteToPm]: props.allowsWriteToPm,
      [EProfileAddFormFields.QueryId]: props.queryId,
      [EProfileAddFormFields.ChatId]: props.chatId,
      [EProfileAddFormFields.Latitude]: props.latitude,
      [EProfileAddFormFields.Longitude]: props.longitude,
      [EProfileAddFormFields.AgeFrom]: props.ageFrom,
      [EProfileAddFormFields.AgeTo]: props.ageTo,
      [EProfileAddFormFields.Distance]: props.distance,
      [EProfileAddFormFields.Page]: props.page,
      [EProfileAddFormFields.Size]: props.size,
    },
    signupForm: {
      [EProfileAddFormFields.Email]: props.email,
      [EProfileAddFormFields.MobileNumber]: props.mobileNumber,
      [EProfileAddFormFields.Password]: props.password,
      [EProfileAddFormFields.Username]: props.userName,
      [EProfileAddFormFields.FirstName]: props.firstName,
      [EProfileAddFormFields.LastName]: props.lastName,
    },
  };
};
