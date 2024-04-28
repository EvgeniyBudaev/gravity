"use client";

import Link from "next/link";
import { type FC, useMemo } from "react";
import { TReviewList } from "@/app/api/review/list";
import { useTranslation } from "@/app/i18n/client";
import { DEFAULT_RATING_SIZE } from "@/app/pages/reviewsPage/constants";
import { ReviewList } from "@/app/pages/reviewsPage/reviewList";
import { Container } from "@/app/shared/components/container";
import { Header } from "@/app/shared/components/header";
import { DEFAULT_COUNT_REVIEWS_TODAY_BY_PROFILE } from "@/app/shared/constants/review";
import { ERoutes } from "@/app/shared/enums";
import { createPath } from "@/app/shared/utils";
import { Rating } from "@/app/uikit/components/rating";
import "./ReviewsPage.scss";
import isEmpty from "lodash/isEmpty";

type TProps = {
  profileId?: number;
  reviewList?: TReviewList;
};

export const ReviewsPage: FC<TProps> = ({ profileId, reviewList }) => {
  const { t } = useTranslation("index");
  console.log("reviewList: ", reviewList);

  const isShowAddReview = useMemo(() => {
    if (isEmpty(reviewList?.content) || !reviewList) return true;
    return (
      !isEmpty(reviewList?.content) &&
      reviewList.countItemsTodayByProfile <
        DEFAULT_COUNT_REVIEWS_TODAY_BY_PROFILE
    );
  }, [reviewList]);

  return (
    <div className="ReviewsPage">
      <Header className="SidebarContent-Header">
        <div />
        <div>{t("common.actions.reviews")}</div>
        {isShowAddReview && (
          <Link
            className="Header-Action"
            href={createPath({
              route: ERoutes.ReviewAdd,
            })}
          >
            {t("common.actions.add")}
          </Link>
        )}
      </Header>
      <Container>
        <div className="ReviewsPage-RatingBlock">
          <div>{t("common.title.ratingTotal")}</div>
          <Rating
            allowFraction={true}
            initialValue={reviewList?.ratingAverage}
            readonly={true}
            size={DEFAULT_RATING_SIZE}
          />
        </div>
        <div className="ReviewsPage-Title">{t("common.title.reviews")}</div>
        <ReviewList profileId={profileId} reviewList={reviewList} />
      </Container>
    </div>
  );
};
