import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getProfileBySessionId } from "@/app/api/profile/getBySessionId";
import { getReviewDetail } from "@/app/api/review/detail";
import { ProfileBlocked } from "@/app/entities/profile/profileBlocked";
import { ProfileDeleted } from "@/app/entities/profile/profileDeleted";
import { ReviewDeleted } from "@/app/entities/review/reviewDeleted";
import { ReviewEditPage } from "@/app/pages/reviewEditPage";
import { ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";

type TLoader = {
  id: string;
};

async function reviewEditLoader(params: TLoader) {
  const session = (await getServerSession(authOptions)) as TSession;
  if (!session) {
    return redirect(
      createPath({
        route: ERoutes.Login,
      }),
    );
  }
  const { id } = params;
  try {
    const profileResponse = await getProfileBySessionId({
      sessionId: session.user.id,
    });
    const profile = profileResponse.data;
    const reviewDetailResponse = await getReviewDetail({ id });
    const review = reviewDetailResponse.data;
    return { profile, review };
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string; id: string };
};

export default async function ReviewDetailRoute(props: TProps) {
  const { params } = props;
  const { lng, id } = params;
  const data = await reviewEditLoader({ id });

  if (data?.profile?.isBlocked) {
    return <ProfileBlocked />;
  }

  if (data?.profile?.isDeleted) {
    return <ProfileDeleted />;
  }

  if (data?.review?.hasDeleted) {
    return <ReviewDeleted />;
  }

  return <ReviewEditPage lng={lng} review={data?.review} />;
}
