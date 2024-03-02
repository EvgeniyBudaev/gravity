import type { FC } from "react";
import { i18n } from "i18next";
import { Icon } from "@/app/uikit/components/icon";
import "./ErrorUI.scss";

type TProps = {
  error?: Error;
  i18n: i18n;
  message?: string;
};

export const ErrorUI: FC<TProps> = ({ error, i18n, message }) => {
  const errorMessage =
    message || error?.message || i18n.t("errorBoundary.common.unexpectedError");

  return (
    <section className="ErrorUI">
      <div className="ErrorUI-Inner">
        <div className="ErrorUI-Content">
          <div className="ErrorUI-IconBox">
            <Icon className="ErrorUI-Icon" type="Attention" />
          </div>
          <div className="ErrorUI-Message">
            <h3 className="ErrorUI-TitleProd">{errorMessage}</h3>
          </div>
        </div>
      </div>
    </section>
  );
};
