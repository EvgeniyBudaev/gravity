import { type FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import "./ReviewDeleted.scss";

export const ReviewDeleted: FC = () => {
  const { t } = useTranslation("index");

  return (
    <div className="ReviewDeleted">
      <div className="ReviewDeleted-Title">
        {t("common.titles.reviewDeleted")}
      </div>
    </div>
  );
};
