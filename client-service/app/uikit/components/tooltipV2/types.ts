import type { ReactNode } from "react";
import type { PopperProps } from "react-popper";

export type TModifiers = PopperProps<any>["modifiers"];
export type TPlacement = PopperProps<any>["placement"];

export type TClasses = {
  root?: string;
  arrow?: string;
  children?: ReactNode;
  popperContent?: string;
  popperElement?: string;
  referenceElement?: string;
};

export type TTooltipProps = {
  children?: ReactNode;
  classes?: TClasses;
  dataTestId?: string;
  isOpen?: boolean;
  isVisible?: boolean;
  message: ReactNode;
  modifiers?: TModifiers;
  placement?: TPlacement;
  timerDelay?: number;
  showTimerDelay?: number;
};
