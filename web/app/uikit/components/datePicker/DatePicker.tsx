"use client";

import { memo, type FC } from "react";
import { Calendar } from "react-date-range";
import type { CalendarProps } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DEFAULT_AGE } from "@/app/uikit/constants";

type TProps = {
  locale?: Locale;
  maxDate?: Date;
  minDate?: Date;
  onChange?: (date: Date) => void;
  value?: Date;
} & CalendarProps;

const DatePickerComponent: FC<TProps> = (props) => {
  const { locale, onChange, value } = props;
  const currentDate = new Date();
  let initialDate = new Date();
  initialDate.setFullYear(currentDate.getFullYear() - DEFAULT_AGE);

  return (
    <Calendar
      {...props}
      date={value || initialDate}
      locale={locale}
      onChange={onChange}
    />
  );
};

export const DatePicker = memo(DatePickerComponent);
