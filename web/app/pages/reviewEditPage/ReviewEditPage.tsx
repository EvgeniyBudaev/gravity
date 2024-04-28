"use client";

import { type FC } from "react";
import type { TReviewDetail } from "@/app/api/review/add";
import { ReviewForm } from "@/app/entities/review/reviewForm";
import { Container } from "@/app/shared/components/container";
import { useSessionNext } from "@/app/shared/hooks";
import type { TSession } from "@/app/shared/types/session";
import { redirect } from "next/navigation";
import { createPath } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";

type TProps = {
  lng: string;
  review?: TReviewDetail;
};

export const ReviewEditPage: FC<TProps> = ({ lng, review }) => {
  const { data: session } = useSessionNext();
  const keycloakSession = session as TSession;
  const isPermissions = review?.sessionId == keycloakSession?.user.id;

  if (!isPermissions) {
    return redirect(
      createPath({
        route: ERoutes.Reviews,
      }),
    );
  }

  return (
    <div>
      <Container>
        <ReviewForm
          isEdit={true}
          profileId={review?.profileId}
          review={review}
        />
      </Container>
    </div>
  );
};
