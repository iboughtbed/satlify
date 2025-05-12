const LANGUAGES = {
  en: "English",
  ru: "Russian",
} as const;

export type Locale = keyof typeof LANGUAGES;

export const languageConfig = LANGUAGES;

export const defaultLocale: Locale = "en";

export const locales: Locale[] = Object.keys(LANGUAGES) as Locale[];

export const availableLocales = locales.map((code) => ({
  code,
  name: LANGUAGES[code],
}));
