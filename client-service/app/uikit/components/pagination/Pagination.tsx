"use client";

import clsx from "clsx";
import { type FC } from "react";
import ReactPaginate from "react-paginate";
import { Icon } from "@/app/uikit/components/icon";
import { ETheme } from "@/app/uikit/enums";
import "./Pagination.scss";

interface IPaginationProps {
  className?: string;
  dataTestId?: string;
  forcePage?: number;
  initialPage?: number;
  marginPagesDisplayed?: number;
  onChangePage: ({ selected }: { selected: number }) => void;
  pagesCount: number;
  pageRangeDisplayed?: number;
  theme?: ETheme;
}

export const Pagination: FC<IPaginationProps> = ({
  className,
  dataTestId = "uikit__pagination",
  forcePage,
  initialPage,
  marginPagesDisplayed = 3,
  onChangePage,
  pagesCount,
  pageRangeDisplayed = 3,
  theme,
}) => {
  const isDark = theme === ETheme.Dark;

  return (
    <ReactPaginate
      activeClassName="Pagination__active"
      breakClassName="Pagination__page-item"
      breakLinkClassName="Pagination__page-link"
      containerClassName={clsx(
        "Pagination",
        { Pagination__dark: isDark },
        className,
      )}
      data-testid={dataTestId}
      forcePage={forcePage}
      initialPage={initialPage}
      marginPagesDisplayed={marginPagesDisplayed}
      nextClassName="Pagination__page-item"
      nextLinkClassName="Pagination__page-link"
      onPageChange={onChangePage}
      pageClassName="Pagination__page-item"
      pageCount={pagesCount}
      pageLinkClassName="Pagination__page-link"
      pageRangeDisplayed={pageRangeDisplayed}
      previousClassName="Pagination__page-item"
      previousLinkClassName="Pagination__page-link"
      previousLabel={
        <>
          <Icon type="ArrowLeft" />
        </>
      }
      nextLabel={
        <>
          <Icon type="ArrowRight" />
        </>
      }
    />
  );
};
