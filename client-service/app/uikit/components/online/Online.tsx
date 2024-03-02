import clsx from "clsx";
import { type FC } from "react";
import "./Online.scss";

type TClasses = {
  root?: string;
};

type TProps = {
  classes?: TClasses;
  isOnline?: boolean;
  message?: string;
};

export const Online: FC<TProps> = ({ classes, isOnline, message }) => {
  if (!isOnline) return null;

  return (
    <div className={clsx(classes?.root, "Online")}>
      <div className="Online-Circle" />
      {message && <div className="Online-Message">{message}</div>}
    </div>
  );
};
