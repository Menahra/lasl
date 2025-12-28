import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES_LABELS,
} from "@lasl/app-contracts/locales";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import {
  mockedChangeLocaleFn,
  setI18nLoading,
} from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { polyfillPointerEvents } from "@/tests/unit-integration/__mocks__/polyfillPointerEvents.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

describe("LanguageSelect", () => {
  beforeAll(() => {
    polyfillPointerEvents();
  });

  const renderLanguageSelect = () =>
    renderWithProviders(LanguageSelect, {
      i18n: true,
    });
  const user = userEvent.setup();
  it("renders the current locale label", () => {
    renderLanguageSelect();

    expect(
      screen.getByText(SUPPORTED_LOCALES_LABELS[DEFAULT_LOCALE]),
    ).toBeInTheDocument();
  });

  it("shows all available languages when opened", async () => {
    renderLanguageSelect();

    await user.click(screen.getByRole("combobox", { name: "Language" }));

    for (const localeLabel of Object.values(SUPPORTED_LOCALES_LABELS)) {
      if (localeLabel !== SUPPORTED_LOCALES_LABELS[DEFAULT_LOCALE]) {
        expect(screen.getByText(localeLabel)).toBeVisible();
      } else {
        expect(screen.getAllByText(localeLabel)).toHaveLength(2);
      }
    }
  });

  it("calls changeLocale when selecting a language", async () => {
    renderLanguageSelect();

    await userEvent.click(screen.getByRole("combobox", { name: "Language" }));

    await userEvent.click(screen.getByText(SUPPORTED_LOCALES_LABELS["de-DE"]));

    expect(mockedChangeLocaleFn).toHaveBeenCalledWith("de-DE");
  });

  it("shows skeleton while loading", () => {
    setI18nLoading(true);
    renderLanguageSelect();

    expect(
      screen.queryByRole("combobox", { name: "Language" }),
    ).not.toBeInTheDocument();
  });
});
