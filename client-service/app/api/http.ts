import { Environment } from "@/app/environment";
import { createApi } from "@/app/shared/utils";

export const { fetchApi, setApiLanguage, getApiLanguage } = createApi({
  basePath: Environment.NEXT_PUBLIC_API_URL,
  timeout: 50_000,
  retry: 1,
});
