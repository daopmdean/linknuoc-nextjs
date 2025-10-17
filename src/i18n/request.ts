import { getRequestConfig } from "next-intl/server";
import { getServerLocale } from "@/src/lib/server-locale";

export default getRequestConfig(async () => {
  // Get locale from cookie or fallback to default
  const locale = getServerLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
