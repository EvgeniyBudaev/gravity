"use client";

import { Telegram, WebApp } from "@twa-dev/types";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

export const useTelegram = () => {
  const telegram =
    // @ts-ignore
    (typeof window !== "undefined" ? window?.Telegram?.WebApp : undefined) ??
    undefined;
  if (typeof window !== "undefined") {
    window?.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
  }
  const [tg, setTg] = useState<WebApp | undefined>();

  useEffect(() => {
    setTg(telegram);
  }, [telegram]);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
  };
};
