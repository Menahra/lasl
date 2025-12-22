import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@lasl/app-contracts/locales";
// biome-ignore lint/style/noExportedImports: ok here
import { i18n } from "@lingui/core";

const LOCALE_IDENTIFIER = "userLocale";

export const switchI18nLocale = async (newLocale: SupportedLocale) => {
  try {
    const { messages } = await import(`../locales/${newLocale}/messages.po`);

    if (!messages) {
      throw new Error(`No messages found for locale: ${newLocale}`);
    }

    i18n.load(newLocale, messages);
    i18n.activate(newLocale);

    localStorage.setItem(LOCALE_IDENTIFIER, newLocale);
  } catch (error) {
    console.error(`Failed to load locale ${newLocale}: `, error);

    if (newLocale !== DEFAULT_LOCALE) {
      console.warn(`Falling back to default locale: ${DEFAULT_LOCALE}`);
      await switchI18nLocale(DEFAULT_LOCALE);
    } else {
      throw new Error(`Failed to load default locale ${DEFAULT_LOCALE}`);
    }
  }
};

export const getInitialLocale = (
  userLocale?: SupportedLocale,
): SupportedLocale => {
  const storedLocale = localStorage.getItem(
    LOCALE_IDENTIFIER,
  ) as SupportedLocale | null;
  if (storedLocale) {
    return storedLocale;
  }

  if (userLocale) {
    return userLocale;
  }

  const browserLocale = navigator.language;
  if (SUPPORTED_LOCALES.includes(browserLocale as SupportedLocale)) {
    return browserLocale as SupportedLocale;
  }

  return DEFAULT_LOCALE;
};

export const initI18n = async (
  ...args: Parameters<typeof getInitialLocale>
) => {
  const initialLocale = getInitialLocale(...args);
  await switchI18nLocale(initialLocale);

  return initialLocale;
};

export { i18n };
