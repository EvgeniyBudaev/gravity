import { useTranslation } from "@/app/i18n";
import { LoginPage } from "@/app/pages/loginPage";
import { ELanguage } from "@/app/shared/enums";

export default async function LoginRoute({
  params: { lng },
}: {
  params: { lng: ELanguage };
}) {
  const { i18n } = await useTranslation(lng, "index");

  return <LoginPage i18n={i18n} lng={lng} />;
}
