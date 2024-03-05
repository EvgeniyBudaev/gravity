"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import type { TProfileBySessionId } from "@/app/api/profile/getBySessionId";
import type { TProfileList } from "@/app/api/profile/list";
import { SearchForm } from "@/app/entities/search/searchForm";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import { useNavigator, useProxyUrl } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { Online } from "@/app/uikit/components/online";
import "./MainPage.scss";

type TProps = {
  lng: ELanguage;
  profile?: TProfileBySessionId;
  profileList?: TProfileList;
};

export const MainPage: FC<TProps> = ({ lng, profile, profileList }) => {
  const navigator = useNavigator({ lng });
  const { proxyUrl } = useProxyUrl();

  return (
    <div className="MainPage">
      <SearchForm lng={lng} profile={profile} />
      <div className="MainPage-List">
        {(profileList?.content ?? []).map((item) => (
          <Link
            href={{
              pathname: createPath({
                route: ERoutes.Profile,
                params: { id: item.id },
                lng: lng,
              }),
              query: {
                latitude: (navigator?.latitudeGPS ?? "").toString(),
                longitude: (navigator?.longitudeGPS ?? "").toString(),
              },
            }}
            key={item.id}
          >
            <div className="MainPage-WrapperImage" key={item.id}>
              <Online
                classes={{ root: "MainPage-Online" }}
                isOnline={item.isOnline}
              />
              <Image
                alt=""
                className="MainPage-Image"
                fill={true}
                priority={true}
                sizes="100vw"
                src={`${proxyUrl}${item.image.url}`}
                quality={100}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
