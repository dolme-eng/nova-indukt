import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Locale detection settings
  localeDetection: true,
  
  // Cookie settings
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  }
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
