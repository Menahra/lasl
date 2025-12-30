import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@lasl/app-contracts/locales";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { PropsWithChildren } from "react";
import { messages as enMessages } from "@/src/locales/en-US/messages.ts";

type TestI18nProviderProps = PropsWithChildren<{
  locale?: SupportedLocale;
}>;

export const TestI18nProvider = ({
  locale = DEFAULT_LOCALE,
  children,
}: TestI18nProviderProps) => {
  i18n.load(locale, enMessages);
  i18n.activate(locale);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
