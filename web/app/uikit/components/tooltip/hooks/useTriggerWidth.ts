import { type MutableRefObject, useState } from "react";
import { useDidMountEffect } from "@/app/uikit/hooks";

export type TUseTriggerWidth = (args: {
  fullTriggerWidth: boolean;
  triggerRef?: MutableRefObject<HTMLDivElement | null>;
}) => {
  triggerWidth: number | undefined;
};

export const useTriggerWidth: TUseTriggerWidth = ({
  fullTriggerWidth,
  triggerRef,
}) => {
  const [triggerWidth, setTriggerWidth] = useState(
    () => triggerRef?.current?.clientWidth || undefined,
  );

  useDidMountEffect(() => {
    const onResize = () => {
      setTriggerWidth(triggerRef?.current?.clientWidth);
    };

    if (fullTriggerWidth) {
      onResize();
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  });

  return { triggerWidth };
};
