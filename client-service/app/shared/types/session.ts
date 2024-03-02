import { EPermissions } from "@/app/shared/enums";

export type TSession = {
  access_token: string;
  error?: string | null;
  expires: string;
  id_token: string;
  roles: EPermissions[];
  user: {
    email: string;
    emailVerified: string;
    firstName: string;
    id: string;
    lastName: string;
    name: string;
    username: string;
  };
};
