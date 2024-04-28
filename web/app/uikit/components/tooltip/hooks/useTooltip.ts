import { useBoolean } from "@/app/uikit/hooks";

export const useTooltip = ({ initialIsOpen = false }) => {
  const [isOpen, { open, close, toggle }] = useBoolean(initialIsOpen);

  return {
    isOpen,
    openTooltip: open,
    closeTooltip: close,
    toggleTooltip: toggle,
  };
};
