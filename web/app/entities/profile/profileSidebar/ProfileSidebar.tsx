"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { type ForwardedRef, forwardRef, memo, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { deleteProfileAction } from "@/app/actions/profile/delete/deleteProfileAction";
import type { TProfile } from "@/app/api/profile/add";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/profilePage/enums";
import { Header } from "@/app/shared/components/header";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import { ERoutes } from "@/app/shared/enums";
import { useSessionNext } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { Icon } from "@/app/uikit/components/icon";
import { Sidebar } from "@/app/uikit/components/sidebar";
import "./ProfileSidebar.scss";

type TProps = {
  isSidebarOpen: boolean;
  onCloseSidebar?: () => void;
  profile?: TProfile;
};

const ProfileSidebarComponent = forwardRef(
  (
    { isSidebarOpen, onCloseSidebar, profile }: TProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): JSX.Element => {
    const { data: session } = useSessionNext();
    const isSession = Boolean(session);
    const buttonSubmitRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation("index");
    const [state] = useFormState(deleteProfileAction, INITIAL_FORM_STATE);

    useEffect(() => {
      if (
        (!isNil(state?.data) && state?.success && !state?.error) ||
        !isSession
      ) {
        const path = createPath({
          route: ERoutes.Login,
        });
        redirect(path);
      }
    }, [isSession, state?.data, state?.error, state?.success]);

    const handleDeleteAccount = () => {
      buttonSubmitRef.current && buttonSubmitRef.current.click();
    };

    const handleSubmit = () => {
      if (profile?.id) {
        const formDataDto = new FormData();
        formDataDto.append(EFormFields.Id, profile.id.toString());
        deleteProfileAction({}, formDataDto);
        onCloseSidebar?.();
      }
    };

    return (
      <div className="ProfileSidebar">
        <Sidebar isActive={isSidebarOpen} onClose={onCloseSidebar} ref={ref}>
          <Header className="SidebarContent-Header">
            <Icon
              className="SidebarContent-Header-Cancel"
              onClick={onCloseSidebar}
              type="ArrowBack"
            />
            <div>{t("common.actions.settings")}</div>
            <div />
          </Header>
          <div className="SidebarContent-List">
            <div
              className="SidebarContent-List-Item SidebarContent-List-Item-Delete"
              onClick={handleDeleteAccount}
            >
              {t("common.actions.deleteAccount")}
            </div>
          </div>
          <form action={handleSubmit} className="ProfileSidebar-Form">
            <input hidden={true} ref={buttonSubmitRef} type="submit" />
          </form>
        </Sidebar>
      </div>
    );
  },
);

ProfileSidebarComponent.displayName = "ProfileSidebar";

export const ProfileSidebar = memo(ProfileSidebarComponent);
