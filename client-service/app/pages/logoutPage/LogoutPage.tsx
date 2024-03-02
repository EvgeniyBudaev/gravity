"use client";

import { FC, useEffect } from "react";
import { notify } from "@/app/uikit/components/toast/utils";
import { signOut } from "next-auth/react";

async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/logout`, { method: "GET" });
  } catch (error) {
    notify.error({ title: error as string });
  }
}

export const LogoutPage: FC = () => {
  useEffect(() => {
    handleLogout();
  }, []);
  const handleLogout = () => {
    keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
  };

  return null;
};
