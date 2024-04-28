"use client";

import { SessionProvider } from "next-auth/react";
import type { FC, ReactNode } from "react";

type TProps = {
  children?: ReactNode;
};

export const SessionProviderWrapper: FC<TProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
