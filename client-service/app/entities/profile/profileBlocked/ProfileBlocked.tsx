"use client";

import { type FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import "./ProfileBlocked.scss";

export const ProfileBlocked: FC = () => {
  const { t } = useTranslation("index");

  return (
    <div className="ProfileBlocked">
      <div className="ProfileBlocked-Title">
        {t("common.titles.accountBlocked")}
      </div>
    </div>
  );
};
