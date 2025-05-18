// i18n
export const I18N_LOCALE_COOKIE_NAME = "i18n:locale";

export const sectionTypes = ["math", "verbal"] as const;
export const questionTypes = ["multiple_choice", "grid_in"] as const;

export const practiceTestTypes = ["math", "verbal", "full"] as const;
export const testAttemptStatuses = [
  "pending",
  "active",
  "paused",
  "completed",
] as const;
