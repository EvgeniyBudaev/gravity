import type { FC } from "react";
import { ProfileForm } from "@/app/entities/profile/profileForm";

type TProps = {
  lng: string;
};

export const ProfileAddPage: FC<TProps> = (props) => {
  return <ProfileForm {...props} />;
};
