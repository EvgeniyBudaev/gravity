"use client";

import clsx from "clsx";
import type { FC, ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import type { TDropDownClasses } from "@/app/uikit/components/dropDown/types";
import { Overlay } from "@/app/uikit/components/overlay";
import { TRANSITION } from "@/app/uikit/constants";
import { DropDownProvider } from "@/app/uikit/context";
import { useDropDown, useDropDownContext } from "@/app/uikit/hooks";
import "./DropDown.scss";

type TProps = {
  children?: ReactNode;
  classes?: TDropDownClasses;
  dataTestId?: string;
  transition?: number;
};

export const DropDown = ({
  children,
  classes,
  dataTestId = "uikit__dropDown",
  transition,
}: TProps): JSX.Element => {
  const dropDownState = useDropDown();

  return (
    <DropDownProvider value={dropDownState}>
      <Overlay
        timeout={transition ?? TRANSITION}
        isActive={dropDownState.isDropDownOpen}
      />
      <div
        className={clsx("DropDown", classes?.dropDown)}
        data-testid={dataTestId}
      >
        {children}
      </div>
    </DropDownProvider>
  );
};

type TDropDownButton = {
  children?: ReactNode;
  classes?: TDropDownClasses;
};

const DropDownButton: FC<TDropDownButton> = ({ children, classes }) => {
  const dropDownState = useDropDownContext();

  return (
    <div
      className={clsx("DropDown-Button", classes?.dropDownButton)}
      onClick={dropDownState?.onClickButtonDropDown}
      ref={dropDownState?.refButtonDropDown}
    >
      {children}
    </div>
  );
};

DropDown.Button = DropDownButton;

type TDropDownPanel = {
  children?: ReactNode;
  classes?: TDropDownClasses;
  dataTestId?: string;
  transition?: number;
};

const DropDownPanel: FC<TDropDownPanel> = ({
  children,
  classes,
  dataTestId = "uikit__dropDown",
  transition,
}) => {
  const dropDownState = useDropDownContext();

  return (
    <CSSTransition
      className={clsx("DropDown-Panel", classes?.dropDownPanel)}
      data-testid={dataTestId}
      in={dropDownState?.isDropDownOpen}
      nodeRef={dropDownState?.refPanelDropDown}
      onClick={dropDownState?.onClickButtonDropDown}
      timeout={transition ?? TRANSITION}
      unmountOnExit
    >
      <div ref={dropDownState?.refPanelDropDown}>{children}</div>
    </CSSTransition>
  );
};

DropDown.Panel = DropDownPanel;
