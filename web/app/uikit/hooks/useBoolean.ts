import { useState } from "react";

type TUseBooleanActions = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  set(value: boolean): void;
};

export function useBoolean(
  initialValue = false,
): [boolean, TUseBooleanActions] {
  const [is, setIs] = useState(initialValue);

  return [
    is,
    {
      open: () => setIs(true),
      close: () => setIs(false),
      toggle: () => setIs(!is),
      set: (value: boolean) => setIs(value),
    },
  ];
}
