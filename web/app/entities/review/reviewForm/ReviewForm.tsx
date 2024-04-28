"use client";

import isNil from "lodash/isNil";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type FC, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { addReviewAction } from "@/app/actions/review/add/addReviewAction";
import { editReviewAction } from "@/app/actions/review/edit/editReviewAction";
import type { TReviewDetail } from "@/app/api/review/add";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/reviewAddPage/enums";
import { Field } from "@/app/shared/components/form/field";
import { Header } from "@/app/shared/components/header";
import { Section } from "@/app/shared/components/section";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import { DEFAULT_RATING } from "@/app/shared/constants/rating";
import { ERoutes } from "@/app/shared/enums";
import { createPath } from "@/app/shared/utils";
import { Icon } from "@/app/uikit/components/icon";
import { Rating } from "@/app/uikit/components/rating";
import { Textarea } from "@/app/uikit/components/textarea";
import "./ReviewForm.scss";

type TProps = {
  isEdit?: boolean;
  profileId?: number;
  review?: TReviewDetail;
};

export const ReviewForm: FC<TProps> = ({ isEdit, profileId, review }) => {
  const [state, formAction] = useFormState(
    isEdit ? editReviewAction : addReviewAction,
    INITIAL_FORM_STATE,
  );
  const buttonSubmitRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("index");
  const [rating, setRating] = useState(
    isEdit ? review?.rating ?? DEFAULT_RATING : DEFAULT_RATING,
  );
  console.log("ReviewForm state: ", state);

  useEffect(() => {
    if (!isNil(state?.data) && state.success && !state?.error) {
      const path = createPath({
        route: ERoutes.Reviews,
      });
      redirect(path);
    }
  }, [state]);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSave = () => {
    buttonSubmitRef.current && buttonSubmitRef.current.click();
  };

  const handleSubmit = (formData: FormData) => {
    if (!profileId) return;
    const formDataDto = new FormData();
    const message = formData.get(EFormFields.Message);
    formDataDto.append(EFormFields.ProfileId, profileId.toString());
    formDataDto.append(EFormFields.Rating, rating.toString());
    formDataDto.append(EFormFields.Message, message ?? "");
    if (isEdit && review?.id) {
      formDataDto.append("id", review.id.toString());
    }
    formAction(formDataDto);
  };

  return (
    <div className="ReviewForm">
      <form action={handleSubmit}>
        <Header className="SidebarContent-Header">
          <div className="Header-Action">
            <Link
              className="ReviewForm-Link"
              href={createPath({
                route: ERoutes.Reviews,
              })}
            >
              <Icon type="ArrowBack" />
            </Link>
          </div>
          <div>{t("common.titles.reviewAdd")}</div>
          <div className="Header-Action" onClick={handleSave}>
            {t("common.actions.save")}
          </div>
        </Header>
        <div>
          <div className="ReviewForm-Star">
            <span className="ReviewForm-Required">*</span>&nbsp;-&nbsp;
            {t("common.titles.required")}
          </div>
          <Section isRequired={true} title={t("common.form.field.rating")}>
            <Field>
              <Rating
                errors={state?.errors?.rating}
                initialValue={rating}
                onChange={handleRating}
              />
            </Field>
          </Section>
          <Field>
            <Textarea
              defaultValue={isEdit ? review?.message ?? undefined : undefined}
              classes={{ textarea: "ReviewForm-Textarea" }}
              isShowMaxLength={true}
              label={t("common.form.field.message") ?? "Message"}
              name={EFormFields.Message}
              maxLength={1000}
              type="text"
            />
          </Field>
        </div>
        <input hidden={true} ref={buttonSubmitRef} type="submit" />
      </form>
    </div>
  );
};
