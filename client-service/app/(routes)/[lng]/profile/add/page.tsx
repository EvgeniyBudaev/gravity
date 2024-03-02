import { ProfileAddPage } from "@/app/pages/profileAddPage";

type TProps = {
  params: { lng: string };
};

export default async function ProfileAddRoute(props: TProps) {
  const { params } = props;
  const { lng } = params;

  return <ProfileAddPage lng={lng} />;
}
