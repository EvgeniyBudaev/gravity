"use client";
import { forwardRef, memo } from "react";
import ReactDOM from "react-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { DATA_TEST_ID } from "@/app/uikit/components/tooltip/constants";
import { ETooltipPlaces } from "@/app/uikit/components/tooltip/enums";
import { useTriggerWidth } from "@/app/uikit/components/tooltip/hooks";
import type { TTooltipProps } from "@/app/uikit/components/tooltip/types";

const TooltipComponent = forwardRef<HTMLDivElement, TTooltipProps>(
  (
    {
      children,
      className,
      clickable = true,
      dataTestId = DATA_TEST_ID,
      fullTriggerWidth = false,
      id,
      isOpen,
      noArrow = false,
      opacity = "0.9",
      openOnClick = false,
      place = ETooltipPlaces.Top,
      triggerRef,
    },
    ref,
  ) => {
    const { triggerWidth } = useTriggerWidth({
      fullTriggerWidth,
      triggerRef,
    });

    return ReactDOM.createPortal(
      <div className="Tooltip" data-testid={dataTestId}>
        <ReactTooltip
          anchorSelect={`#${id}`}
          className={className}
          clickable={clickable}
          isOpen={isOpen}
          noArrow={noArrow}
          opacity={opacity}
          openOnClick={openOnClick}
          place={place}
        >
          <div
            ref={ref}
            style={{
              width:
                fullTriggerWidth && triggerRef?.current && triggerWidth
                  ? `${triggerWidth}px`
                  : "auto",
            }}
          >
            {children}
          </div>
        </ReactTooltip>
      </div>,
      document.body,
    );
  },
);

TooltipComponent.displayName = "Tooltip";

export const Tooltip = memo(TooltipComponent) as typeof TooltipComponent;
