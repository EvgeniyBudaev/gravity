import { type FC } from "react";
import { Icon } from "@/app/uikit/components/icon";
import "./SearchBar.scss";

type TProps = {
  title?: string;
};

export const SearchBar: FC<TProps> = ({ title }) => {
  return (
    <div className="SearchBar">
      <Icon className="SearchBar-Icon" type="Search" />
      <div>{title}</div>
    </div>
  );
};
