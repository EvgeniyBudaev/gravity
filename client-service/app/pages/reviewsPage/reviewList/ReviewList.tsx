import isEmpty from "lodash/isEmpty";
import { type FC } from "react";
import type { TReviewList } from "@/app/api/review/list";
import { useTranslation } from "@/app/i18n/client";
import { ReviewListItem } from "@/app/pages/reviewsPage/reviewListItem";
import { NavigationPanel } from "@/app/uikit/components/navigationPanel";
import { usePagination } from "@/app/uikit/hooks";
import "./ReviewList.scss";

type TProps = {
  profileId?: number;
  reviewList?: TReviewList;
};

export const ReviewList: FC<TProps> = ({ profileId, reviewList }) => {
  const { t } = useTranslation("index");
  const { onChangePage, page } = usePagination();

  return (
    <div className="ReviewList">
      <div className="ReviewList-Inner">
        <div className="ReviewList-Content">
          {isEmpty(reviewList?.content) && <div>{t("reviews.noReviews")}</div>}
          {(reviewList?.content ?? []).map((review) => (
            <ReviewListItem key={review.id} review={review} />
          ))}
        </div>
        <div className="ReviewList-Footer">
          {!isEmpty(reviewList?.content) && (
            <NavigationPanel
              currentPage={page}
              pagesCount={reviewList?.countPages ?? 0}
              onChangePage={onChangePage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
