import clsx from "clsx";
import type { FC, ReactNode } from "react";
import "./Header.scss";

type TProps = {
  children?: ReactNode;
  className?: string;
};

export const Header: FC<TProps> = ({ children, className }) => {
  return <div className={clsx("Header", className)}>{children}</div>;
};
