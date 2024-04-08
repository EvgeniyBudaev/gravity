import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import {Environment} from "@/app/environment";
import { I18nContextProvider } from "@/app/i18n/context";
import { InitClient } from "@/app/shared/components/init";
import { Layout as LayoutComponent } from "@/app/shared/components/layout";
import { ELanguage } from "@/app/shared/enums";
import { SessionProviderWrapper } from "@/app/shared/utils/auth";
import { ToastContainer } from "@/app/uikit/components/toast/toastContainer";
import "react-toastify/dist/ReactToastify.css";
import "@/app/styles/_index.scss";

export const metadata: Metadata = {
  title: "Love",
  description: "Love assistant",
};

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: ReactNode;
  params: { lng: ELanguage };
}>) {
  const isProduction = Environment.NODE_ENV === "production";
  return (
    <html lang={lng}>
      <head>
        {isProduction && (
          <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        )}
        <title>Love</title>
      </head>
      <SessionProviderWrapper>
        <body>
          <I18nContextProvider lng={lng}>
            <InitClient />
            <ToastContainer />
            <LayoutComponent isProduction={isProduction} lng={lng}>{children}</LayoutComponent>
          </I18nContextProvider>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}
