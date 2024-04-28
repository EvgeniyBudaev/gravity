"use client";

import clsx from "clsx";
import { memo, type FC } from "react";
import {
  DATE_FORMAT,
  TIME_FORMAT,
} from "@/app/uikit/components/dateTime/constants";
import { useDayjs } from "@/app/uikit/components/dateTime/hooks";
import "./DateTime.scss";

type TProps = {
  className?: string;
  classes?: { date?: string; time?: string };
  dateFormat?: string;
  dataTestId?: string;
  isTime?: boolean;
  isUtc?: boolean;
  value?: Date | string | number | null;
};

const DateTimeComponent: FC<TProps> = ({
  className,
  classes,
  dateFormat,
  dataTestId = "uikit__date-time",
  isTime = true,
  isUtc = true,
  value,
}) => {
  const { dayjs } = useDayjs();

  return (
    <div className={clsx("DateTime", className)} data-testid={dataTestId}>
      <div className={clsx("DateTime-Date", classes?.date)}>
        {isUtc
          ? dayjs(value)
              .utc()
              .format(dateFormat ?? DATE_FORMAT)
          : dayjs(value).format(dateFormat ?? DATE_FORMAT)}
      </div>
      {isTime && (
        <div className={clsx("DateTime-Time", classes?.time)}>
          {isUtc
            ? dayjs(value).utc().format(TIME_FORMAT)
            : dayjs(value).format(TIME_FORMAT)}
        </div>
      )}
    </div>
  );
};

export const DateTime = memo(DateTimeComponent);
