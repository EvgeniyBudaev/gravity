"use client";

import { memo } from "react";
import type { FC, MouseEvent } from "react";
import { Rating as RatingUI, RatingProps } from "react-simple-star-rating";
import { Error } from "@/app/uikit/components/error";

type TProps = {
  allowFraction?: boolean;
  dataTestId?: string;
  errors?: string | string[];
  initialValue?: number;
  onChange?:
    | ((
        value: number,
        index: number,
        event?: MouseEvent<HTMLSpanElement> | undefined,
      ) => void)
    | undefined;
  size?: number;
} & RatingProps;

const RatingComponent: FC<TProps> = ({
  allowFraction = false,
  dataTestId = "uikit__rating",
  errors,
  initialValue,
  onChange,
  size,
  ...props
}) => {
  return (
    <>
      <RatingUI
        {...props}
        allowFraction={allowFraction}
        data-testid={dataTestId}
        initialValue={initialValue}
        onClick={onChange}
        size={size}
      />
      {errors && (
        <div className="InputField-ErrorField">
          <Error errors={errors} />
        </div>
      )}
    </>
  );
};

export const Rating = memo(RatingComponent);
