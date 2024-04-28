import Link from "next/link";
import type { FC } from "react";
import type { TReviewListItem } from "@/app/api/review/list";
import { DEFAULT_RATING_SIZE } from "@/app/pages/reviewsPage/constants";
import { DeleteReview } from "@/app/pages/reviewsPage/reviewListItem/deleteReview";
import { ERoutes } from "@/app/shared/enums";
import { useSessionNext } from "@/app/shared/hooks";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";
import { DateTime } from "@/app/uikit/components/dateTime";
import { Icon } from "@/app/uikit/components/icon";
import { Rating } from "@/app/uikit/components/rating";
import "./ReviewListItem.scss";

type TProps = {
  review: TReviewListItem;
};

export const ReviewListItem: FC<TProps> = ({ review }) => {
  const { data: session } = useSessionNext();
  const keycloakSession = session as TSession;
  const isPermissions = review.sessionId == keycloakSession?.user.id;

  return (
    <div className="ReviewListItem">
      {review?.message && (
        <div className="ReviewListItem-Inner">
          <div className="ReviewListItem-Header">
            <div className="ReviewListItem-Info">
              <div className="ReviewListItem-DisplayName">
                {review.displayName},
              </div>
              <DateTime
                dateFormat="DD.MM.YY"
                isTime={false}
                value={review.createdAt}
              />
            </div>
            {isPermissions && (
              <div className="ReviewListItem-IconList">
                <Link
                  href={createPath({
                    route: ERoutes.ReviewEdit,
                    params: { id: review.id },
                  })}
                >
                  <Icon
                    className="ReviewListItem-IconList-IconEdit"
                    type="Edit"
                  />
                </Link>
                <DeleteReview reviewId={review.id} />
              </div>
            )}
          </div>
          <Rating
            className="ReviewListItem-Rating"
            initialValue={review.rating}
            size={DEFAULT_RATING_SIZE}
          />
          <div className="ReviewListItem-Message">{review?.message}</div>
        </div>
      )}
    </div>
  );
};
