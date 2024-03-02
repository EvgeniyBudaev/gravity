import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getProfileDetail } from "@/app/api/profile/detail";
import { ProfileDeleted } from "@/app/entities/profile/profileDeleted";
import { ProfileBlocked } from "@/app/entities/profile/profileBlocked";
import { ProfilePage } from "@/app/pages/profilePage";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";

type TSearchParams = {
  latitude?: string;
  longitude?: string;
};

type TLoader = {
  id: string;
  searchParams: TSearchParams;
};

async function loader(params: TLoader) {
  const session = (await getServerSession(authOptions)) as TSession;
  if (!session) {
    return redirect(
      createPath({
        route: ERoutes.Login,
      }),
    );
  }
  const { id, searchParams } = params;
  try {
    const profileDetailResponse = await getProfileDetail({
      id: id,
      viewerId: session.user.id,
      latitude: searchParams?.latitude ?? "",
      longitude: searchParams?.longitude ?? "",
    });
    const profile = profileDetailResponse.data;
    return { profile };
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string; id: string };
  searchParams?: TSearchParams;
};

export default async function ProfileDetailRoute(props: TProps) {
  const { params } = props;
  const { lng, id } = params;
  const language = lng as ELanguage;
  const data = await loader({ id, searchParams: props?.searchParams ?? {} });

  if (data?.profile?.isBlocked) {
    return <ProfileBlocked />;
  }

  if (data?.profile?.isDeleted) {
    return <ProfileDeleted />;
  }

  return <ProfilePage lng={language} profile={data?.profile} />;
}
