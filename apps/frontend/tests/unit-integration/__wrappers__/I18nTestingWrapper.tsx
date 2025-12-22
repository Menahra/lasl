import { DEFAULT_LOCALE } from "@lasl/app-contracts/locales";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import type { ReactElement } from "react";
import { messages as enMessages } from "@/src/locales/en-US/messages.ts";

interface RenderWithI18nOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: string;
}

export const renderWithI18n = (
  component: ReactElement,
  { locale = DEFAULT_LOCALE, ...renderOptions }: RenderWithI18nOptions = {},
): RenderResult => {
  i18n.load(locale, enMessages);
  i18n.activate(locale);

  return render(
    <I18nProvider i18n={i18n}>{component}</I18nProvider>,
    renderOptions,
  );
};
