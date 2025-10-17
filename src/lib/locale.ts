export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const DEFAULT_LOCALE = "vi";
export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Client-side locale management
export function getClientLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const locale =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.split("=")[1] || DEFAULT_LOCALE;

  return SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
}

export function setClientLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  // Set cookie with 1 year expiration
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}
