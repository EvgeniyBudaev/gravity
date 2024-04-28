import type { FC, ReactNode } from "react";
import "./Field.scss";

type TProps = {
  children: ReactNode;
};

export const Field: FC<TProps> = ({ children }) => {
  return <div className="Field">{children}</div>;
};
