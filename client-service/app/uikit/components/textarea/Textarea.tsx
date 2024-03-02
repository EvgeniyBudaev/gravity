"use client";

import clsx from "clsx";
import { forwardRef, memo, useState } from "react";
import type {
  ChangeEvent,
  DetailedHTMLProps,
  ForwardedRef,
  HTMLAttributes,
  FocusEvent,
} from "react";
import { Error } from "@/app/uikit/components/error";
// import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "../input/Input.scss";

type TClasses = {
  textarea?: string;
};

export interface ITextareaProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  autoComplete?: string;
  classes?: TClasses;
  className?: string;
  dataTestId?: string;
  errors?: string | string[];
  hidden?: boolean;
  isFocused?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isShowMaxLength?: boolean;
  label?: string;
  name?: string;
  maxLength?: number;
  type?: string;
  value?: string;
}

const TextareaComponent = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  (
    {
      autoComplete,
      classes,
      className,
      dataTestId = "uikit__textarea",
      defaultValue,
      errors,
      hidden,
      isFocused: isInputFocused,
      isReadOnly,
      isRequired,
      isShowMaxLength,
      label,
      name,
      maxLength,
      type,
      onBlur,
      onChange,
      onFocus,
      ...rest
    }: ITextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): JSX.Element => {
    const [currentLength, setCurrentLength] = useState(0);
    const [isFocused, setIsFocused] = useState<boolean | undefined>(
      isInputFocused || !!defaultValue,
    );

    const onBlurCallback = (event: FocusEvent<HTMLTextAreaElement>) => {
      if (event.target.value !== "") {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }

      if (onBlur) {
        onBlur(event);
      }
    };

    const onFocusCallback = (event: FocusEvent<HTMLTextAreaElement>) => {
      if (!isFocused) {
        setIsFocused(true);
      }

      if (onFocus) {
        onFocus(event);
      }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(event.target.value.length);
      onChange?.(event);
    };

    return (
      <div
        className={clsx("InputField", className, {
          InputField__active: isFocused && !isReadOnly,
        })}
        data-testid={dataTestId}
      >
        {label && (
          <label className="InputField-Label" htmlFor={name}>
            <span>{label}</span>
            {/*<Typography*/}
            {/*  value={label}*/}
            {/*  variant={*/}
            {/*    !isFocused ? ETypographyVariant.TextB3Regular : ETypographyVariant.TextB4Regular*/}
            {/*  }*/}
            {/*/>*/}
            {isRequired && <span className="InputField-LabelRequired"> *</span>}
          </label>
        )}
        <div className="InputField-Wrapper">
          <div
            className={clsx("InputField-Inner Textarea", {
              "InputField-Inner__active": isFocused,
              "InputField-Inner__error": errors,
            })}
          >
            <textarea
              {...rest}
              autoComplete={autoComplete}
              className={clsx(className, classes?.textarea, "Input Textarea", {
                Input__active: isFocused,
              })}
              defaultValue={defaultValue}
              hidden={hidden}
              name={name}
              maxLength={maxLength}
              onBlur={onBlurCallback}
              onChange={handleChange}
              onFocus={onFocusCallback}
              ref={ref}
            />
          </div>
          {isShowMaxLength && maxLength && (
            <div className="Textarea-MaxLength">
              {currentLength}/{maxLength}
            </div>
          )}
          {errors && (
            <div className="InputField-ErrorField">
              <Error errors={errors} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

TextareaComponent.displayName = "TextareaComponent";

export const Textarea = memo(TextareaComponent);
