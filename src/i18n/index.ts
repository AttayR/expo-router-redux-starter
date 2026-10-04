import { getLocales } from 'expo-localization';
import { I18n, type TranslateOptions } from 'i18n-js';
import { useCallback } from 'react';

import { useAppSelector } from '@/store/hooks';
import { selectLanguagePreference, type LanguagePreference } from '@/store/settings-slice';

import { en } from './en';
import { es } from './es';

export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const i18n = new I18n({ en, es });
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

/** Picks the device language when the user hasn't chosen one. */
export function resolveLocale(preference: LanguagePreference): Locale {
  if (preference !== 'system') return preference;
  const device = getLocales()[0]?.languageCode ?? 'en';
  return (SUPPORTED_LOCALES as readonly string[]).includes(device) ? (device as Locale) : 'en';
}

/** Dot-separated paths to every string in the English catalog, e.g. "signIn.title". */
type Paths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];
export type TranslationKey = Paths<typeof en>;

/** Returns a typed `t()` that re-renders when the language setting changes. */
export function useTranslation() {
  const locale = resolveLocale(useAppSelector(selectLanguagePreference));
  const t = useCallback(
    (key: TranslationKey, options?: TranslateOptions) => i18n.t(key, { ...options, locale }),
    [locale]
  );
  return { t, locale };
}
