import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getProfileBySessionId } from "@/app/api/profile/getBySessionId";
import { getReviewList } from "@/app/api/review/list";
import { ProfileBlocked } from "@/app/entities/profile/profileBlocked";
import { ProfileDeleted } from "@/app/entities/profile/profileDeleted";
import { ReviewsPage } from "@/app/pages/reviewsPage";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/app/shared/constants/pagination";
import { ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";

type TSearchParams = {
  page?: string;
  size?: string;
  profileId?: string;
};

type TReviewsLoader = {
  searchParams: TSearchParams;
};

async function reviewsLoader(params: TReviewsLoader) {
  const session = (await getServerSession(authOptions)) as TSession;
  if (!session) {
    return redirect(
      createPath({
        route: ERoutes.Login,
      }),
    );
  }
  const { searchParams } = params;
  try {
    const profileResponse = await getProfileBySessionId({
      sessionId: session.user.id,
    });
    if (profileResponse.success) {
      const profile = profileResponse.data;
      const reviewListResponse = await getReviewList({
        page: searchParams?.page ?? DEFAULT_PAGE.toString(),
        size: searchParams?.size ?? DEFAULT_PAGE_SIZE.toString(),
        profileId: searchParams?.profileId ?? (profile?.id ?? "").toString(),
      });
      const reviewList = reviewListResponse.data;
      return { profile, profileId: profile?.id, reviewList };
    }
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams?: TSearchParams;
};

export default async function ReviewsRoute(props: TProps) {
  const data = await reviewsLoader({ searchParams: props?.searchParams ?? {} });

  if (data?.profile?.isBlocked) {
    return <ProfileBlocked />;
  }

  if (data?.profile?.isDeleted) {
    return <ProfileDeleted />;
  }

  return (
    <ReviewsPage profileId={data?.profileId} reviewList={data?.reviewList} />
  );
}
