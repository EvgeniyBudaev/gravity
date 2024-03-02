import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getProfileBySessionId } from "@/app/api/profile/getBySessionId";
import { getProfileList } from "@/app/api/profile/list";
import { ProfileBlocked } from "@/app/entities/profile/profileBlocked";
import { ProfileDeleted } from "@/app/entities/profile/profileDeleted";
import { MainPage } from "@/app/pages/mainPage";
import { DEFAULT_DISTANCE } from "@/app/shared/constants/distance";
import {
  DEFAULT_AGE_FROM,
  DEFAULT_AGE_TO,
  DEFAULT_LOOKING_FOR,
  DEFAULT_SEARCH_GENDER,
} from "@/app/shared/constants/filter";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/app/shared/constants/pagination";
import { ELanguage, ERoutes } from "@/app/shared/enums";
import type { TSession } from "@/app/shared/types/session";
import { createPath } from "@/app/shared/utils";
import { Todo } from "@/app/pages/Todo";

type TSearchParams = {
  page?: string;
  size?: string;
  ageFrom?: string;
  ageTo?: string;
  searchGender?: string;
  lookingFor?: string;
  sessionId?: string;
  distance?: string;
  latitude?: string;
  longitude?: string;
};

type TMainLoader = {
  searchParams: TSearchParams;
};

async function mainLoader(params: TMainLoader) {
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
    if (searchParams?.sessionId) {
      const query = {
        page: searchParams?.page ?? DEFAULT_PAGE.toString(),
        size: searchParams?.size ?? DEFAULT_PAGE_SIZE.toString(),
        ageFrom: searchParams?.ageFrom ?? DEFAULT_AGE_FROM.toString(),
        ageTo: searchParams?.ageTo ?? DEFAULT_AGE_TO.toString(),
        searchGender: searchParams?.searchGender ?? DEFAULT_SEARCH_GENDER,
        lookingFor: searchParams?.lookingFor ?? DEFAULT_LOOKING_FOR,
        sessionId: session?.user.id,
        distance: searchParams?.distance ?? DEFAULT_DISTANCE.toString(),
        latitude: searchParams?.latitude ?? "",
        longitude: searchParams?.longitude ?? "",
      };
      const profileListResponse = await getProfileList(query);
      const profileResponse = await getProfileBySessionId({
        sessionId: session?.user.id,
        latitude: searchParams?.latitude ?? "",
        longitude: searchParams?.longitude ?? "",
      });
      const profile = profileResponse.data;

      const profileList = profileListResponse.data;
      return { profile, profileList };
    }
    return { profile: undefined, profileList: undefined };
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams?: TSearchParams;
};

export default async function MainRoute(props: TProps) {
  const { params } = props;
  const { lng } = params;
  const language = lng as ELanguage;
  const data = await mainLoader({ searchParams: props?.searchParams ?? {} });

  if (data?.profile?.isBlocked) {
    return <ProfileBlocked />;
  }

  if (data?.profile?.isDeleted) {
    return <ProfileDeleted />;
  }

  return (
    <main>
      <MainPage
        lng={language}
        profile={data?.profile}
        profileList={data?.profileList}
      />
    </main>
  );

  // return (
  //   <main>
  //     <Todo />
  //   </main>
  // );
}
