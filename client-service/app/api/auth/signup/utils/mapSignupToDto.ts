import { EProfileAddFormFields } from "@/app/pages/profileAddPage/enums";
import { TFile } from "@/app/shared/types/file";

type TProps = {
  [EProfileAddFormFields.Username]: string;
  [EProfileAddFormFields.DisplayName]: string;
  [EProfileAddFormFields.Email]?: string | null;
  [EProfileAddFormFields.MobileNumber]: string;
  [EProfileAddFormFields.Password]: string;
  [EProfileAddFormFields.PasswordConfirm]: string;
  [EProfileAddFormFields.Birthday]: string;
  [EProfileAddFormFields.Gender]: string;
  [EProfileAddFormFields.SearchGender]?: string | null;
  [EProfileAddFormFields.Location]?: string | null;
  [EProfileAddFormFields.Description]?: string | null;
  [EProfileAddFormFields.Height]?: string | null;
  [EProfileAddFormFields.Weight]?: string | null;
  [EProfileAddFormFields.LookingFor]?: string | null;
  [EProfileAddFormFields.Image]: TFile | TFile[];
  [EProfileAddFormFields.TelegramID]: string;
  [EProfileAddFormFields.TelegramUsername]: string;
  [EProfileAddFormFields.FirstName]?: string | null;
  [EProfileAddFormFields.LastName]?: string | null;
  [EProfileAddFormFields.LanguageCode]: string;
  [EProfileAddFormFields.AllowsWriteToPm]: string;
  [EProfileAddFormFields.QueryId]: string;
  [EProfileAddFormFields.Latitude]: string;
  [EProfileAddFormFields.Longitude]: string;
  [EProfileAddFormFields.AgeFrom]: string;
  [EProfileAddFormFields.AgeTo]: string;
  [EProfileAddFormFields.Distance]: string;
  [EProfileAddFormFields.Page]: string;
  [EProfileAddFormFields.Size]: string;
};

type TSignupForm = {
  [EProfileAddFormFields.Email]?: string | null;
  [EProfileAddFormFields.MobileNumber]: string;
  [EProfileAddFormFields.Password]: string;
  [EProfileAddFormFields.Username]: string;
  [EProfileAddFormFields.FirstName]?: string | null;
  [EProfileAddFormFields.LastName]?: string | null;
};

type TProfileForm = {
  [EProfileAddFormFields.Username]: string;
  [EProfileAddFormFields.DisplayName]: string;
  [EProfileAddFormFields.Birthday]: string;
  [EProfileAddFormFields.Gender]: string;
  [EProfileAddFormFields.SearchGender]?: string | null;
  [EProfileAddFormFields.Location]?: string | null;
  [EProfileAddFormFields.Description]?: string | null;
  [EProfileAddFormFields.Height]?: string | null;
  [EProfileAddFormFields.Weight]?: string | null;
  [EProfileAddFormFields.LookingFor]?: string | null;
  [EProfileAddFormFields.Image]: TFile | TFile[];
  [EProfileAddFormFields.TelegramID]: string;
  [EProfileAddFormFields.TelegramUsername]: string;
  [EProfileAddFormFields.FirstName]?: string | null;
  [EProfileAddFormFields.LastName]?: string | null;
  [EProfileAddFormFields.LanguageCode]: string;
  [EProfileAddFormFields.AllowsWriteToPm]: string;
  [EProfileAddFormFields.QueryId]: string;
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
