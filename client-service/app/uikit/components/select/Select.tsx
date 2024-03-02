"use client";

import { FC, type ReactNode, useRef } from "react";
import { Icon } from "@/app/uikit/components/icon";
import { Sidebar } from "@/app/uikit/components/sidebar";
import "./Select.scss";
import { Error } from "@/app/uikit/components/error";

type TProps = {
  children?: ReactNode;
  errors?: string | string[];
  headerTitle?: string | number;
  isRequired?: boolean;
  isSidebarOpen?: boolean;
  label?: string | ReactNode;
  onHeaderClick?: () => void;
  onSidebarClose?: () => void;
};

export const Select: FC<TProps> = ({
  children,
  errors,
  headerTitle,
  isRequired = false,
  isSidebarOpen = false,
  label,
  onHeaderClick,
  onSidebarClose,
}) => {
  const sidebarRef = useRef(null);

  return (
    <div className="Select">
      <div className="Select-Header" onClick={onHeaderClick}>
        <div className="Select-Header-Label">
          {label}
          {isRequired && (
            <span className="Select-Header-LabelRequired"> *</span>
          )}
        </div>
        <div className="Select-HeaderRight">
          <div className="Select-Header-Value">{headerTitle ?? "--"}</div>
          <Icon type="ArrowRight" />
        </div>
      </div>
      {errors && (
        <div className="InputField-ErrorField">
          <Error errors={errors} />
        </div>
      )}
      <Sidebar
        isActive={isSidebarOpen}
        onClose={onSidebarClose}
        ref={sidebarRef}
      >
        {children}
      </Sidebar>
    </div>
  );
};
