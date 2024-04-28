import { type FC } from "react";
import { Container } from "@/app/shared/components/container";
import { ReviewForm } from "@/app/entities/review/reviewForm";

type TProps = {
  profileId?: number;
};

export const ReviewAddPage: FC<TProps> = ({ profileId }) => {
  return (
    <div>
      <Container>
        <ReviewForm profileId={profileId} />
      </Container>
    </div>
  );
};
