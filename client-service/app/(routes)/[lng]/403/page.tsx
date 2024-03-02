import { useTranslation } from "@/app/i18n";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";

export default async function PermissionDeniedRoute({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { i18n, t } = await useTranslation(lng, "index");

  return (
    <ErrorBoundary i18n={i18n} message={t("errorBoundary.common.forbidden")} />
  );
}
