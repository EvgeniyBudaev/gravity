import { LogoutPage } from "@/app/pages/logoutPage";

export default async function LogoutRoute({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return <LogoutPage />;
}
