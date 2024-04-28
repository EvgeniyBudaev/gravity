import type { FC } from "react";
import { i18n } from "i18next";
import { ErrorUI } from "@/app/shared/components/errorUI";

type TProps = {
  error?: Error;
  i18n: i18n;
  message?: string;
};

export const ErrorBoundary: FC<TProps> = (props) => {
  return <ErrorUI {...props} />;
};
