type TUser = {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  name?: string;
  email: string;
};

export type TSession = {
  user: TUser;
  expires: string;
  access_token?: string;
  id_token?: string;
  roles?: string[];
  error?: string | null;
};

export type TRoles = {
  roles: string[];
};

type TDecoded = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  ["allowed-origins"]: string[];
  realm_access: TRoles;
  resource_access: { account: TRoles };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type TToken = {
  name: string;
  sub: string;
  decoded: TDecoded;
  access_token: string;
  id_token: string;
  expires_at: number;
  refresh_token: string;
  iat: number;
  exp: number;
  jti: string;
  error?: string;
};
