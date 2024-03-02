"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, type FC, useRef } from "react";
import { useFormState } from "react-dom";
import { getProfileBySessionIdAction } from "@/app/actions/profile/getBySessionId/getBySessionIdAction";
import { EFormFields } from "@/app/entities/login/loginForm/enums";
import { useTranslation } from "@/app/i18n/client";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";
import { Button } from "@/app/uikit/components/button";
import "./LoginForm.scss";
import { useNavigator } from "@/app/shared/hooks";

type TProps = {
  lng: ELanguage;
};

export const LoginForm: FC<TProps> = ({ lng }) => {
  const navigator = useNavigator({ lng });
  const { data: session, status } = useSession();
  const keycloakSession = session as TSession;
  const { t } = useTranslation("index");
  const isLoading = status === "loading";
  const isSession = Boolean(session);
  const buttonSubmitRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useFormState(
    getProfileBySessionIdAction,
    INITIAL_FORM_STATE,
  );

  useEffect(() => {
    if (isSession && state.data?.sessionId) {
      redirect(
        createPath(
          {
            route: ERoutes.Root,
            lng: lng,
          },
          {
            page: state.data?.filter.page.toString(),
            size: state.data?.filter.size.toString(),
            ageFrom: state.data?.filter.ageFrom.toString(),
            ageTo: state.data?.filter.ageTo.toString(),
            searchGender: state.data?.filter.searchGender,
            lookingFor: state.data?.filter.lookingFor,
            sessionId: keycloakSession.user.id,
            distance: state.data?.filter.distance.toString(),
            latitude: (navigator?.latitudeGPS ?? "").toString(),
            longitude: (navigator?.longitudeGPS ?? "").toString(),
          },
        ),
      );
    }
  }, [
    keycloakSession,
    isSession,
    lng,
    session,
    state.data?.filter.ageFrom,
    state.data?.filter.ageTo,
    state.data?.filter.distance,
    state.data?.filter.page,
    state.data?.filter.searchGender,
    state.data?.filter.size,
    state.data?.sessionId,
    state.data?.filter.lookingFor,
    navigator?.latitudeGPS,
    navigator?.longitudeGPS,
  ]);

  useEffect(() => {
    if (isSession) {
      buttonSubmitRef.current && buttonSubmitRef.current.click();
    }
  }, [isSession, session]);

  const handleSubmit = (formData: FormData) => {
    if (isSession) {
      const formDataDto = new FormData();
      const keycloakSession = session as TSession;
      formDataDto.append(EFormFields.SessionId, keycloakSession?.user.id);
      formAction(formDataDto);
    }
  };

  return (
    <div className="LoginForm">
      <Button
        className="LoginForm-Button"
        onClick={() => signIn("keycloak")}
        aria-disabled={isLoading}
      >
        {t("pages.login.keycloak")}
      </Button>
      <form action={handleSubmit} className="Layout-Form">
        <input hidden={true} ref={buttonSubmitRef} type="submit" />
      </form>
    </div>
  );
};
