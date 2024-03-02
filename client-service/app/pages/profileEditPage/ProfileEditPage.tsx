import type { FC } from "react";
import { TProfile } from "@/app/api/profile/add";
import { ProfileForm } from "@/app/entities/profile/profileForm";

type TProps = {
  lng: string;
  profile?: TProfile;
};

export const ProfileEditPage: FC<TProps> = ({ lng, profile }) => {
  return <ProfileForm isEdit={true} lng={lng} profile={profile} />;
};
