export const locales = ['es', 'en'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'es';

export const isAppLocale = (value: string): value is AppLocale => {
  return locales.includes(value as AppLocale);
};
