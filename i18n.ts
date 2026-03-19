import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['de'] as const;
export const defaultLocale = 'de' as const;

export default getRequestConfig(async ({locale}) => {
  // Use default locale if not provided or invalid
  const validLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
