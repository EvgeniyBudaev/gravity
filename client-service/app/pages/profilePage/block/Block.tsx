"use client";

import isNil from "lodash/isNil";
import { redirect } from "next/navigation";
import { type FC, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { addBlockAction } from "@/app/actions/block/add/addBlockAction";
import { useTranslation } from "@/app/i18n/client";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import { EBlockFormFields } from "@/app/pages/profilePage/block/enums";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import { useQueryURL, useSessionNext } from "@/app/shared/hooks";
import type { TSession } from "@/app/shared/types/session";

type TProps = {
  blockedUserId: number;
  lng: ELanguage;
};

export const Block: FC<TProps> = ({ blockedUserId, lng }) => {
  const { data: session } = useSessionNext();
  const isSession = Boolean(session);
  const { t } = useTranslation("index");
  const [state, formAction] = useFormState(addBlockAction, INITIAL_FORM_STATE);
  const buttonSubmitRef = useRef<HTMLInputElement>(null);
  const { queryURL } = useQueryURL({ lng });

  useEffect(() => {
    if (!isNil(state?.data) && state.success && !state?.error) {
      const rootUrl = `${ERoutes.Root}${lng}${queryURL}`;
      redirect(rootUrl);
    }
  }, [lng, queryURL, state?.data, state?.error, state.success]);

  const handleBlock = () => {
    buttonSubmitRef.current && buttonSubmitRef.current.click();
  };

  const handleSubmit = (formData: FormData) => {
    if (isSession && blockedUserId) {
      const formDataDto = new FormData();
      const keycloakSession = session as TSession;
      formDataDto.append(EBlockFormFields.SessionId, keycloakSession?.user.id);
      formDataDto.append(
        EBlockFormFields.BlockedUserId,
        blockedUserId.toString(),
      );
      formAction(formDataDto);
    }
  };

  return (
    <>
      <div
        className="DropDown-MenuItem DropDown-MenuItem-Warning"
        onClick={handleBlock}
      >
        {t("common.actions.block")}
      </div>
      <form action={handleSubmit} className="Block-Form">
        <input hidden={true} ref={buttonSubmitRef} type="submit" />
      </form>
    </>
  );
};
