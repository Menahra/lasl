export const SCREENREADER_CLASSNAME = "screenreader-only";
// biome-ignore lint/security/noSecrets: this is not a secret
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const ACCESS_TOKEN_NAME = "accessToken";
export const AUTHENTICATION_TYPE = "Bearer";

export const PROJECT_NAME = "Marqa";
export const PROJECT_SUBTITLE = "Where Words Find Their Roots";

export const AVAILABLE_LOCALES = ["en-US", "de-DE", "fr-FR"] as const;
export type AvailableLocales = (typeof AVAILABLE_LOCALES)[number];
export const LOCALE_LABELS: Record<AvailableLocales, string> = {
  // biome-ignore lint/security/noSecrets: a translation, not a secret
  "de-DE": "Deutsch (Deutschland)",
  "en-US": "English (United States)",
  "fr-FR": "Français (France)",
};
export const DEFAULT_LOCALE = "en-US";

export const GITHUB_PROJECT_LINK = "https://github.com/Menahra/lasl";
export const DONATE_PROJECT_LINK = "https://ko-fi.com/zioui";
