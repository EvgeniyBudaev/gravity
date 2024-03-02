"use client";

import clsx from "clsx";
import { type FC, type ReactNode, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Header } from "@/app/shared/components/header";
import { Icon } from "@/app/uikit/components/icon";
import type { TSelectOption } from "@/app/uikit/components/select";
import "./SidebarContent.scss";

type TClasses = {
  item?: string;
};

type TProps = {
  children?: ReactNode;
  classes?: TClasses;
  options?: TSelectOption[];
  onCloseSidebar?: () => void;
  onSave?: (value?: TSelectOption) => void;
  selectedItem?: TSelectOption;
  title: string;
};

export const SidebarContent: FC<TProps> = ({
  children,
  classes,
  onSave,
  options,
  onCloseSidebar,
  selectedItem,
  title,
}) => {
  const [checkedItem, setCheckedItem] = useState<TSelectOption | undefined>(
    selectedItem,
  );
  const { t } = useTranslation("index");

  return (
    <>
      <Header className="SidebarContent-Header">
        <Icon
          className="SidebarContent-Header-Cancel"
          onClick={onCloseSidebar}
          type="ArrowBack"
        />
        <div>{title}</div>
        <div
          className="SidebarContent-Header-Save"
          onClick={() => onSave?.(checkedItem)}
        >
          {t("common.actions.save")}
        </div>
      </Header>
      {options && (
        <div className="SidebarContent-List">
          {(options ?? []).map((item) => {
            const isChecked = item.value === checkedItem?.value;
            return (
              <div
                className={clsx("SidebarContent-List-Item", classes?.item, {
                  ["SidebarContent-List-Item__isChecked"]: isChecked,
                })}
                key={item.value}
                onClick={() => setCheckedItem(item)}
              >
                <div>{item.label}</div>
                {isChecked && <Icon type="Checkbox" />}
              </div>
            );
          })}
        </div>
      )}
      <div className="SidebarContent-List">{children}</div>
    </>
  );
};
