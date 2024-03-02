"use client";

import { type FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import "./ProfileDeleted.scss";

export const ProfileDeleted: FC = () => {
  const { t } = useTranslation("index");

  return (
    <div className="ProfileDeleted">
      <div className="ProfileDeleted-Title">
        {t("common.titles.accountDeleted")}
      </div>
    </div>
  );
};
