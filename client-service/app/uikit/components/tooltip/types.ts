import type { MutableRefObject, PropsWithChildren } from "react";
import { ETooltipPlaces } from "@/app/uikit/components/tooltip/enums";

export type TTooltipPlaces = `${ETooltipPlaces}`;

export type TTooltipProps = PropsWithChildren<{
  clickable?: boolean;
  className?: string;
  dataTestId?: string;
  fullTriggerWidth?: boolean;
  id: string;
  isOpen?: boolean;
  noArrow?: boolean;
  opacity?: string;
  openOnClick?: boolean;
  place?: TTooltipPlaces;
  triggerRef?: MutableRefObject<HTMLDivElement | null>;
}>;
