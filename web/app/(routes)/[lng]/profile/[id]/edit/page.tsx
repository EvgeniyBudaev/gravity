import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getProfileDetail } from "@/app/api/profile/detail";
import { ProfileBlocked } from "@/app/entities/profile/profileBlocked";
import { ProfileDeleted } from "@/app/entities/profile/profileDeleted";
import { useTranslation } from "@/app/i18n";
import { ProfileEditPage } from "@/app/pages/profileEditPage";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";

type TLoader = {
  id: string;
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
  const { id } = params;
  try {
    const profileDetailResponse = await getProfileDetail({
      id: id,
      viewerId: session.user.id,
    });
    const profile = profileDetailResponse.data;

    return { profile };
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string; id: string };
};

export default async function ProfileEditRoute(props: TProps) {
  const { params } = props;
  const { lng, id } = params;
  const { i18n, t } = await useTranslation(lng, "index");

  try {
    const data = await loader({ id });

    if (data?.profile?.isBlocked) {
      return <ProfileBlocked />;
    }

    if (data?.profile?.isDeleted) {
      return <ProfileDeleted />;
    }

    return <ProfileEditPage lng={lng} profile={data?.profile} />;
  } catch (error) {
    const err = error as Error;
    return <ErrorBoundary i18n={i18n} message={t(err.message)} />;
  }
}
