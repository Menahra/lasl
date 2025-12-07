// biome-ignore lint/style/noExportedImports: ok here
import { i18n } from "@lingui/core";
import {
  AVAILABLE_LOCALES,
  type AvailableLocales,
  DEFAULT_LOCALE,
} from "@/src/shared/constants.ts";

const LOCALE_IDENTIFIER = "userLocale";

export const switchI18nLocale = async (newLocale: AvailableLocales) => {
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
  userLocale?: AvailableLocales,
): AvailableLocales => {
  const storedLocale = localStorage.getItem(
    LOCALE_IDENTIFIER,
  ) as AvailableLocales | null;
  if (storedLocale) {
    return storedLocale;
  }

  if (userLocale) {
    return userLocale;
  }

  const browserLocale = navigator.language;
  if (AVAILABLE_LOCALES.includes(browserLocale as AvailableLocales)) {
    return browserLocale as AvailableLocales;
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
