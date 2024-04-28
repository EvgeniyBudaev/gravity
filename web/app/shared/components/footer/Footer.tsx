import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC, useEffect, useMemo } from "react";
import type { TProfileBySessionId } from "@/app/api/profile/getBySessionId";
import { useTranslation } from "@/app/i18n/client";
import { NavLink } from "@/app/shared/components/navLink";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import {
  useNavigator,
  useProxyUrl,
  useQueryURL,
  useSessionNext,
} from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { Avatar } from "@/app/uikit/components/avatar";
import { DropDown } from "@/app/uikit/components/dropDown";
import { Icon } from "@/app/uikit/components/icon";
import { notify } from "@/app/uikit/components/toast/utils";
import "./Footer.scss";

type TProps = {
  lng: ELanguage;
  profile?: TProfileBySessionId;
};

async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/logout`, { method: "GET" });
  } catch (error) {
    notify.error({ title: error as string });
  }
}

export const Footer: FC<TProps> = ({ lng, profile }) => {
  const navigator = useNavigator({ lng });
  const pathname = usePathname();
  const { proxyUrl } = useProxyUrl();
  const { t } = useTranslation("index");
  const { data: session, status } = useSessionNext();
  const isSession = Boolean(session);
  const { queryURL } = useQueryURL({ lng });
  const rootUrl = `/${lng}${queryURL}`;
  const isPermissions = profile
    ? !profile?.isBlocked && !profile.isDeleted
    : false;

  const isProfileDetailPage = useMemo(() => {
    if (!profile?.id) return false;
    const path = createPath({
      route: ERoutes.Profile,
      params: { id: profile?.id },
    });
    return pathname === `/${lng}${path}`;
  }, [lng, pathname, profile?.id]);

  useEffect(() => {
    if (
      status != "loading" &&
      session &&
      session?.error === "RefreshAccessTokenError"
    ) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  const handleLogout = () => {
    keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
  };

  return (
    <div className="Footer">
      {isSession && profile && (
        <>
          <div className="Footer-Item">
            <NavLink activeClassName="Footer-Link__isActive" href={rootUrl}>
              <Icon type="Search" />
            </NavLink>
          </div>
          <div className="Footer-Item Footer-Item-Avatar">
            <DropDown>
              <DropDown.Button>
                <div className="Footer-Avatar">
                  <Avatar
                    size={32}
                    image={`${proxyUrl}${profile?.image.url}`}
                  />
                </div>
              </DropDown.Button>
              <DropDown.Panel>
                <>
                  <div className="DropDown-Menu">
                    {!isProfileDetailPage && isPermissions && (
                      <Link
                        className="DropDown-MenuItem"
                        href={{
                          pathname: createPath({
                            route: ERoutes.Profile,
                            params: { id: profile?.id },
                            lng: lng,
                          }),
                          query: {
                            latitude: (navigator?.latitudeGPS ?? "").toString(),
                            longitude: (
                              navigator?.longitudeGPS ?? ""
                            ).toString(),
                          },
                        }}
                      >
                        {t("common.actions.profileDetail")}
                      </Link>
                    )}
                    {isPermissions && (
                      <Link
                        className="DropDown-MenuItem"
                        href={createPath({
                          route: ERoutes.Reviews,
                        })}
                      >
                        {t("common.actions.reviews")}
                      </Link>
                    )}
                    <div className="DropDown-MenuItem" onClick={handleLogout}>
                      {t("common.actions.exit")}
                    </div>
                  </div>
                  <div className="DropDown-Menu">
                    <div className="DropDown-MenuItem DropDown-MenuItem-Cancel">
                      {t("common.actions.cancel")}
                    </div>
                  </div>
                </>
              </DropDown.Panel>
            </DropDown>
          </div>
        </>
      )}
    </div>
  );
};
