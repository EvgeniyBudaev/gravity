import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
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
import { ELanguage } from "@/app/shared/enums";
import { useNavigator } from "@/app/shared/hooks/useNavigator";
import type { TSession } from "@/app/shared/types/session";

type TProps = {
  lng: ELanguage;
};

type TResponse = {
  queryURL: string;
};

type TUseQueryURL = (props: TProps) => TResponse;

export const useQueryURL: TUseQueryURL = ({ lng }) => {
  const navigator = useNavigator({ lng });
  const { data: session } = useSession();
  const keycloakSession = session as TSession;
  const sessionId = keycloakSession?.user.id;
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? DEFAULT_PAGE.toString();
  const size = searchParams.get("size") ?? DEFAULT_PAGE_SIZE.toString();
  const ageFrom = searchParams.get("ageFrom") ?? DEFAULT_AGE_FROM.toString();
  const ageTo = searchParams.get("ageTo") ?? DEFAULT_AGE_TO.toString();
  const searchGender =
    searchParams.get("searchGender") ?? DEFAULT_SEARCH_GENDER;
  const lookingFor = searchParams.get("lookingFor") ?? DEFAULT_LOOKING_FOR;
  const distance = searchParams.get("distance") ?? DEFAULT_DISTANCE.toString();
  const latitudeGPS = (navigator?.latitudeGPS ?? "").toString();
  const longitudeGPS = (navigator?.longitudeGPS ?? "").toString();

  const queryURL = useMemo(() => {
    return `?page=${page}&size=${size}&ageFrom=${ageFrom}&ageTo=${ageTo}&searchGender=${searchGender}&lookingFor=${lookingFor}&sessionId=${sessionId}&distance=${distance}&latitude=${latitudeGPS}&longitude=${longitudeGPS}`;
  }, [
    page,
    size,
    ageFrom,
    ageTo,
    searchGender,
    lookingFor,
    sessionId,
    distance,
    latitudeGPS,
    longitudeGPS,
  ]);

  return {
    queryURL,
  };
};
