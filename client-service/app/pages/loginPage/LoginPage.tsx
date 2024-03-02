import Link from "next/link";
import { type FC } from "react";
import { LoginForm } from "@/app/entities/login/loginForm";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import { createPath } from "@/app/shared/utils";
import "./LoginPage.scss";

type TProps = {
  i18n: any;
  lng: ELanguage;
};

export const LoginPage: FC<TProps> = ({ i18n, lng }) => {
  return (
    <div className="LoginPage">
      <div className="LoginPage-Center">
        <div className="LoginPage-Content">
          <div className="LoginPage-Title">{i18n.t("pages.login.title")}</div>
          <div className="LoginPage-Title">
            {i18n.t("pages.login.description")}
          </div>
          <LoginForm lng={lng} />
          <div className="LoginPage-NoAccount">
            {i18n.t("pages.login.noAccount")}&nbsp;
            <Link
              href={createPath({
                route: ERoutes.ProfileAdd,
              })}
            >
              {i18n.t("pages.login.goToSignup")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
