"use client";

import isNil from "lodash/isNil";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { addLikeAction } from "@/app/actions/like/add/addLikeAction";
import { updateLikeAction } from "@/app/actions/like/update/updateLikeAction";
import type { TProfileDetail } from "@/app/api/profile/detail";
import { ProfileSidebar } from "@/app/entities/profile/profileSidebar";
import { useTranslation } from "@/app/i18n/client";
import { Block } from "@/app/pages/profilePage/block";
import { Complaint } from "@/app/pages/profilePage/complaint";
import {
  EAddLikeFormFields,
  ECancelLikeFormFields,
  EUpdateLikeFormFields,
} from "@/app/pages/profilePage/enums";
import { getDistance } from "@/app/pages/profilePage/utils";
import { Container } from "@/app/shared/components/container";
import { Field } from "@/app/shared/components/form/field";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import { useProxyUrl, useSessionNext } from "@/app/shared/hooks";
import { PROFILE_LOOKING_FOR_MAPPING } from "@/app/shared/mapping/profile";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";
import { DATE_FORMAT } from "@/app/uikit/components/dateTime/constants";
import { useDayjs } from "@/app/uikit/components/dateTime/hooks";
import { DropDown } from "@/app/uikit/components/dropDown";
import { Hamburger } from "@/app/uikit/components/hamburger";
import { Icon } from "@/app/uikit/components/icon";
import { Slider } from "@/app/uikit/components/slider";
import { getFullYear } from "@/app/uikit/utils/date";
import "./ProfilePage.scss";

type TProps = {
  lng: ELanguage;
  profile?: TProfileDetail;
};

export const ProfilePage: FC<TProps> = ({ lng, profile }) => {
  const { dayjs } = useDayjs();
  const { data: session } = useSessionNext();
  const isSession = Boolean(session);
  const keycloakSession = session as TSession;
  const { proxyUrl } = useProxyUrl();
  const { t } = useTranslation("index");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const fullYear = getFullYear(profile?.birthday);
  const isSessionUser = Boolean(
    profile?.id && keycloakSession?.user.id === profile?.sessionId,
  );
  const isLiked = !isSessionUser && profile?.like?.isLiked;
  const buttonSubmitRef = useRef<HTMLInputElement | null>(null);
  const [isShowTooltipHeart, setIsShowTooltipHeart] = useState(false);

  const canAddLike = useMemo(() => {
    return !isSessionUser && isNil(profile?.like?.id);
  }, [isSessionUser, profile?.like?.id]);

  const canUpdateLike = useMemo(() => {
    return (
      !isSessionUser && !isNil(profile?.like?.id) && !profile?.like?.isLiked
    );
  }, [isSessionUser, profile?.like?.id, profile?.like?.isLiked]);

  const canCancelLike = useMemo(() => {
    return (
      !isSessionUser && !isNil(profile?.like?.id) && profile?.like?.isLiked
    );
  }, [isSessionUser, profile?.like?.id, profile?.like?.isLiked]);

  const isCanClickHeart = useMemo(() => {
    if (isNil(profile?.like?.updatedAt)) {
      return true;
    }
    const lastClickDate = dayjs(profile?.like?.updatedAt)
      .utc()
      .format(DATE_FORMAT);
    const today = dayjs().utc().format(DATE_FORMAT);
    return canCancelLike || lastClickDate !== today;
  }, [canCancelLike, dayjs, profile?.like?.updatedAt]);

  console.log("profile: ", profile);

  const [state, formAction] = useFormState(
    canAddLike ? addLikeAction : updateLikeAction,
    INITIAL_FORM_STATE,
  );

  const distance = useMemo(() => {
    return profile?.navigator
      ? getDistance(profile.navigator.distance, t)
      : undefined;
  }, [profile?.navigator, t]);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleHeartClick = () => {
    if (isCanClickHeart) {
      buttonSubmitRef.current && buttonSubmitRef.current.click();
      return;
    }
    setIsShowTooltipHeart(true);
  };

  const handleSubmit = (formData: FormData) => {
    if (isSession && profile) {
      const formDataDto = new FormData();
      const keycloakSession = session as TSession;
      if (canAddLike) {
        formDataDto.append(
          EAddLikeFormFields.SessionId,
          keycloakSession?.user.id,
        );
        formDataDto.append(EAddLikeFormFields.LikedUserId, profile.id.toString());
        const message = t("common.actions.like");
        formDataDto.append(EAddLikeFormFields.Message, message);
        formDataDto.append(
          EAddLikeFormFields.Username,
          profile.telegram?.username ?? "",
        );
      }
      if (canCancelLike) {
        formDataDto.append(
          ECancelLikeFormFields.Id,
          (profile.like?.id ?? "").toString(),
        );
        formDataDto.append(ECancelLikeFormFields.IsCancel, "true");
        formDataDto.append(
          ECancelLikeFormFields.LikedUserId,
          profile.id.toString(),
        );
      }
      if (canUpdateLike) {
        formDataDto.append(
          EUpdateLikeFormFields.Id,
          (profile.like?.id ?? "").toString(),
        );
        formDataDto.append(EUpdateLikeFormFields.IsCancel, "false");
        formDataDto.append(
          EUpdateLikeFormFields.LikedUserId,
          profile.id.toString(),
        );
      }
      formAction(formDataDto);
    }
  };

  return (
    <>
      {profile?.id && (
        <DropDown>
          <DropDown.Button>
            <Hamburger />
          </DropDown.Button>
          <DropDown.Panel>
            <div className="DropDown-Menu">
              {!isSessionUser && <Block blockedUserId={profile.id} lng={lng} />}
              {!isSessionUser && (
                <Complaint complaintUserId={profile.id} lng={lng} />
              )}
              {isSessionUser && (
                <>
                  <Link
                    className="DropDown-MenuItem"
                    href={createPath({
                      route: ERoutes.ProfileEdit,
                      params: { id: profile.id },
                    })}
                  >
                    {t("common.actions.edit")}
                  </Link>
                  <div
                    className="DropDown-MenuItem"
                    onClick={handleOpenSidebar}
                  >
                    {t("common.actions.settings")}
                  </div>
                </>
              )}
            </div>
            <div className="DropDown-Menu">
              <div className="DropDown-MenuItem DropDown-MenuItem-Cancel">
                {t("common.actions.cancel")}
              </div>
            </div>
          </DropDown.Panel>
        </DropDown>
      )}
      <ProfileSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={handleCloseSidebar}
        profile={profile}
        ref={sidebarRef}
      />
      <div className="ProfilePage">
        <div className="ProfilePage-Slider">
          <Slider
            images={profile?.images}
            isLiked={isLiked}
            isOnline={profile?.isOnline}
            isSessionUser={isSessionUser}
            messageHeart={
              isShowTooltipHeart ? t("pages.profile.doubleLike") : undefined
            }
            messageOnline={
              profile?.isOnline ? t("common.titles.online") : undefined
            }
            onHeartClick={handleHeartClick}
          />
        </div>
        <Container>
          <div className="ProfilePage-User">
            <div className="ProfilePage-UserAvatar">
              {!isNil(profile?.images?.[0]) ? (
                <Image
                  alt={`${profile?.images?.[0].url}`}
                  className="ProfilePage-UserAvatarImage"
                  height={50}
                  width={50}
                  priority={true}
                  src={`${proxyUrl}${profile?.images?.[0].url}`}
                  quality={100}
                />
              ) : (
                <Icon type="NoImage" />
              )}
            </div>
            <div className="ProfilePage-Inner">
              <div className="ProfilePage-Label">
                {profile?.displayName}, {fullYear}
              </div>
              {!isSessionUser && <div>{distance}</div>}
            </div>
          </div>
          {profile?.description && (
            <Field>
              <div className="ProfilePage-Inner">
                <div>{profile?.description}</div>
              </div>
            </Field>
          )}
          <div className="ProfilePage-Label">
            {t("common.titles.moreDetails")}
          </div>
          {profile?.location && (
            <Field>
              <div className="ProfilePage-Row">
                <Icon className="ProfilePage-Icon" type="Location" />
                <span>{profile?.location}</span>
              </div>
            </Field>
          )}
          {((!isNil(profile?.height) && profile?.height !== 0) ||
            (!isNil(profile?.weight) && profile?.weight !== 0)) && (
            <Field>
              <div className="ProfilePage-Row">
                <Icon className="ProfilePage-Icon" type="Person" />
                {!isNil(profile?.height) && (
                  <span>
                    {profile?.height} {t("common.reductions.cm")}&nbsp;
                  </span>
                )}
                {!isNil(profile?.weight) && (
                  <span>
                    {profile?.weight} {t("common.reductions.kg")}&nbsp;
                  </span>
                )}
              </div>
            </Field>
          )}
          {profile?.filters?.lookingFor && lng && (
            <Field>
              <div className="ProfilePage-Row">
                <Icon className="ProfilePage-Icon" type="Watch" />
                <span>
                  {
                    PROFILE_LOOKING_FOR_MAPPING[profile?.filters?.lookingFor][
                      lng
                    ]
                  }
                </span>
              </div>
            </Field>
          )}
        </Container>
      </div>
      <form action={handleSubmit} className="ProfilePage-Form">
        <input hidden={true} ref={buttonSubmitRef} type="submit" />
      </form>
    </>
  );
};
