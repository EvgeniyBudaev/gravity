"use client";

import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import Image from "next/image";
import type { FC } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { TImage } from "@/app/api/profile/image";
import { useProxyUrl } from "@/app/shared/hooks";
import { Icon } from "@/app/uikit/components/icon";
import { Online } from "@/app/uikit/components/online";
import "./Slider.scss";

type TProps = {
  images?: TImage[] | null;
  isLiked?: boolean;
  isOnline?: boolean;
  isSessionUser: boolean;
  messageHeart?: string;
  messageOnline?: string;
  onHeartClick?: () => void;
};

export const Slider: FC<TProps> = ({
  images,
  isLiked,
  isOnline,
  isSessionUser,
  messageHeart,
  messageOnline,
  onHeartClick,
}) => {
  const { proxyUrl } = useProxyUrl();

  return !isNil(images) && !isEmpty(images) ? (
    <Swiper
      className="Slider"
      modules={[Pagination]}
      pagination={{ type: "progressbar" }}
      spaceBetween={0}
      slidesPerView={1}
    >
      {(images ?? []).map((item) => (
        <SwiperSlide key={item.id}>
          <div className="Slider-WrapperImage">
            <Image
              alt={`${item.url}`}
              className="Slider-Image"
              fill={true}
              priority={true}
              sizes="100vw"
              src={`${proxyUrl}${item.url}`}
              quality={100}
            />
            <Online
              classes={{ root: "Slider-Online" }}
              isOnline={isOnline}
              message={messageOnline}
            />
            {!isSessionUser && (
              <div className="Slider-HeartBlock" onClick={onHeartClick}>
                {isLiked ? (
                  <div className="Slider-HeartInfo">
                    {messageHeart && (
                      <div className="Slider-HeartMessage">{messageHeart}</div>
                    )}
                    <div>
                      <Icon className="Slider-Icon" type="Heart" />
                    </div>
                  </div>
                ) : (
                  <div className="Slider-HeartInfo">
                    {messageHeart && (
                      <div className="Slider-HeartMessage">{messageHeart}</div>
                    )}
                    <div>
                      <Icon className="Slider-Icon" type="HeartEmpty" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <Icon type="NoImage" />
  );
};
