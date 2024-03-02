import { type FC, useRef } from "react";
import { useFormState } from "react-dom";
import { deleteReviewAction } from "@/app/actions/review/delete/deleteReviewAction";
import { useTranslation } from "@/app/i18n/client";
import { EFormFields } from "@/app/pages/reviewsPage/reviewListItem/deleteReview/enums";
import { INITIAL_FORM_STATE } from "@/app/shared/constants/form";
import { DropDown } from "@/app/uikit/components/dropDown";
import { Icon } from "@/app/uikit/components/icon";
import "./DeleteReview.scss";

type TProps = {
  reviewId: number;
};

export const DeleteReview: FC<TProps> = ({ reviewId }) => {
  const { t } = useTranslation("index");
  const [state, formAction] = useFormState(
    deleteReviewAction,
    INITIAL_FORM_STATE,
  );
  const buttonSubmitRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    buttonSubmitRef.current && buttonSubmitRef.current.click();
  };

  const handleSubmit = (formData: FormData) => {
    const formDataDto = new FormData();
    formDataDto.append(EFormFields.Id, reviewId.toString());
    formAction(formDataDto);
  };

  return (
    <div className="DeleteReview">
      <DropDown classes={{ dropDown: "DeleteReview-DropDown" }}>
        <div className="DeleteReview-DeleteButton">
          <DropDown.Button>
            <Icon type="Trash" />
          </DropDown.Button>
        </div>
        <DropDown.Panel>
          <>
            <div className="DropDown-Menu">
              <div className="DropDown-MenuItem" onClick={handleDelete}>
                {t("common.actions.delete")}
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
      <form action={handleSubmit} className="DeleteReview-Form">
        <input hidden={true} ref={buttonSubmitRef} type="submit" />
      </form>
    </div>
  );
};
