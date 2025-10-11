import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from './locale';

// Server-side locale detection
export function getServerLocale(): Locale {
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE;
  return SUPPORTED_LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
}