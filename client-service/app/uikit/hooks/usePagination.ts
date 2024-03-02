import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/app/shared/constants/pagination";

type TUsePagination = () => {
  onChangePage?: ({ selected }: { selected: number }) => void;
  page: number;
  size: number;
};

export const usePagination: TUsePagination = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? DEFAULT_PAGE.toString();
  const size = searchParams.get("size") ?? DEFAULT_PAGE_SIZE.toString();

  const params = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);

  const handleChangePage = useCallback(
    ({ selected }: { selected: number }) => {
      params.set("page", (selected + 1).toString());
      params.set("size", size.toString());
      replace(`${pathname}?${params.toString()}`);
    },
    [params, size, replace, pathname],
  );

  return {
    onChangePage: handleChangePage,
    page: Number(page),
    size: Number(size),
  };
};
