import { useEffect, useRef } from "react";

type TUseDidMountEffect<T = () => unknown> = (cb?: T) => {
  didMount: boolean;
};

export const useDidMountEffect: TUseDidMountEffect = (cb) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current && cb) {
      cb();
    } else {
      didMount.current = true;
    }
  }, [cb]);

  return { didMount: didMount.current };
};
