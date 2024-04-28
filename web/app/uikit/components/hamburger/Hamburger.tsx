import type { FC } from "react";
import { Icon } from "@/app/uikit/components/icon";
import "./Hamburger.scss";

type TProps = {
  onClick?: () => void;
};

export const Hamburger: FC<TProps> = ({ onClick }) => {
  return (
    <div className="Hamburger" onClick={onClick}>
      <Icon type="MoreHoriz" />
    </div>
  );
};
