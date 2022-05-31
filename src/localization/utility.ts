import { fallbackDefaults, localizedStrings } from "./constants";
import { AppLocale, LocalizedStrings } from "./model";

/**
 * A function taking a localization key and returning the localized value for the wrapped local.
 */
export type UIStringLookup = (key: keyof LocalizedStrings) => string;

/**
 * @param setup - Setup object specifying wrapped locale and a default (fallback) locale
 * @returns A function taking a localization key and returning the localized value for the wrapped local.
 */
export const makeUIStringLookup = (setup?: {
  locale?: AppLocale; defaultLocale?: AppLocale
}): UIStringLookup => {
  const {
    locale = AppLocale.EnglishUS,
    defaultLocale = AppLocale.EnglishUS,
  } = setup ?? {};
  return (key) => {
    const localeStrings = localizedStrings[locale] ?? localizedStrings[defaultLocale];
    return localeStrings[key] ?? fallbackDefaults[key];
  };
};
