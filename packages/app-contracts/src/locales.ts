export const SUPPORTED_LOCALES = ["en-US", "de-DE", "fr-FR"] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const SUPPORTED_LOCALES_LABELS: Record<SupportedLocale, string> = {
    // biome-ignore-start lint/security/noSecrets: just some constants
    "de-DE": "Deutsch (Deutschland)",
    "en-US": "English (United States)",
    "fr-FR": "Français (France)"
    // biome-ignore-end lint/security/noSecrets: just some constants
}

export const DEFAULT_LOCALE: SupportedLocale = "en-US";
