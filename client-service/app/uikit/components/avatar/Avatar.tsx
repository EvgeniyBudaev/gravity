"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import type { FC, MouseEvent } from "react";
import { formatInitialUserName, formatToStringWithPx } from "@/app/uikit/utils";
import "./Avatar.scss";

type TProps = {
  altImage?: string;
  backgroundColor?: string;
  className?: string;
  color?: string;
  dataTestId?: string;
  image?: string | null | undefined;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  size?: number;
  user?: string | null | undefined;
};

const AvatarComponent: FC<TProps> = ({
  altImage = "",
  backgroundColor = "#E9E9ED",
  className,
  color = "#0A0A0B",
  dataTestId = "uikit__avatar",
  image,
  onClick,
  size = 24,
  user,
}) => {
  const [imageAvatar, setImageAvatar] = useState<string | null | undefined>(
    image,
  );
  const [userAvatar, setUserAvatar] = useState<string | null | undefined>(user);
  const sizeInner = size;
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setImageAvatar(image);
    setUserAvatar(user);
  }, [image, user]);

  useEffect(() => {
    if (
      !isNil(avatarRef) &&
      !isNil(avatarRef.current) &&
      "style" in avatarRef.current
    ) {
      avatarRef.current.style.setProperty(
        "--avatar-backgroundColor",
        backgroundColor,
      );
      avatarRef.current.style.setProperty("--avatar-color", color);
      avatarRef.current.style.setProperty(
        "--avatar-height",
        formatToStringWithPx(size),
      );
      avatarRef.current.style.setProperty(
        "--avatar-width",
        formatToStringWithPx(size),
      );
      if (!user) {
        avatarRef.current.style.setProperty(
          "--avatar-border",
          "3px solid #0A0A0B",
        );
      }
    }
  }, [backgroundColor, color, size, user]);

  const renderContent = (
    user: string | null | undefined,
    image: string | null | undefined,
  ) => {
    if (!isNil(user) && isNil(image)) {
      return formatInitialUserName(user);
    } else if (isNil(user) && !isNil(image)) {
      return (
        <Image
          alt={altImage}
          className="Avatar-Face"
          height={sizeInner}
          priority={true}
          src={image}
          quality={100}
          width={sizeInner}
        />
      );
    } else {
      return (
        <Image
          alt="аватар"
          height={sizeInner}
          src="https://gas-kvas.com/grafic/uploads/posts/2023-09/1695869715_gas-kvas-com-p-kartinki-bez-13.png"
          quality={100}
          width={sizeInner}
        />
      );
    }
  };

  return (
    <div
      className={clsx("Avatar", className)}
      data-testid={dataTestId}
      ref={avatarRef}
      onClick={onClick}
    >
      <div className={clsx("Avatar-Inner")}>
        {renderContent(userAvatar, imageAvatar)}
      </div>
    </div>
  );
};

export const Avatar = memo(AvatarComponent);
