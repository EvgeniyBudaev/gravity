import type { FC, ReactNode } from "react";
import "./Section.scss";

type TProps = {
  children?: ReactNode;
  isRequired?: boolean;
  title: string | ReactNode;
};

export const Section: FC<TProps> = ({ children, isRequired, title }) => {
  return (
    <div className="Section">
      <div className="Section-Header">
        <span className="Section-Title">
          {title}
          {isRequired && <span className="Section-TitleRequired"> *</span>}
        </span>
      </div>
      <div className="Section-Container">{children}</div>
    </div>
  );
};
