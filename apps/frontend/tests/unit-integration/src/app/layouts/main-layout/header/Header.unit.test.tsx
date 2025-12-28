import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/src/app/layouts/main-layout/header/Header.tsx";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { mockMatchMedia } from "@/tests/unit-integration/__mocks__/matchMediaMock.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

vi.mock("@/src/shared/hooks/useAuthenticationContext.tsx", () => ({
  useAuthenticationContext: () => ({
    user: {},
  }),
}));

describe("Header", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    setI18nLoading(false);
  });

  const renderHeader = () =>
    renderWithProviders(Header, {
      query: true,
      i18n: true,
      router: {
        pathPattern: "/header",
      },
    });

  const user = userEvent.setup();

  it("renders a search field (among other things)", async () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    await renderHeader();

    expect(screen.getByRole("textbox")).toBeVisible();
  });

  it("per default search field has no value", async () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    await renderHeader();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("search field has proper aria label and placeholder", async () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    await renderHeader();
    const searchField = screen.getByRole("textbox");
    expect(searchField).toHaveAccessibleName("Search in all pages");
    expect(searchField).toHaveAttribute("placeholder", "Search...");
  });

  it("renders multiple links of which one for github and one for ko-fi", async () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    await renderHeader();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(1);

    ["localhost", "github", "ko-fi"].forEach((link, index) => {
      expect(
        (screen.getAllByRole("link")[index] as HTMLAnchorElement).href,
      ).toContain(link);
    });
  });

  it("renders a button to change theme to light if current is dark", async () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
      "(prefers-color-scheme: dark)": true,
    });
    await renderHeader();
    const button = screen.getByRole("button", { name: "Switch to light mode" });
    expect(button).toBeVisible();

    expect(button).toHaveAccessibleName("Switch to light mode");
  });

  it("renders a button to change theme to dark if current is light", async () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
      "(prefers-color-scheme: dark)": false,
    });
    await renderHeader();
    const button = screen.getByRole("button", { name: "Switch to dark mode" });
    expect(button).toBeVisible();

    expect(button).toHaveAccessibleName("Switch to dark mode");
  });

  it("renders LanguageSelect in desktop view", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    await renderHeader();
    expect(screen.getByRole("combobox", { name: "Language" })).toBeVisible();
  });

  it("shows skeleton for search input when loading", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    setI18nLoading(true);

    await renderHeader();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("renders HeaderDrawer on mobile instead of inline search/buttons", async () => {
    mockMatchMedia({ "(min-width: 768px)": false });
    await renderHeader();
    expect(screen.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  it("updates search value when typing", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    await renderHeader();
    const input = screen.getByRole("textbox");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("toggles theme when LightDarkModeButton is clicked", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    await renderHeader();
    const button = screen.getByRole("button", {
      name: /Switch to dark|light mode/i,
    });
    await user.click(button);
    expect(button).toHaveAccessibleName(/Switch to dark|light mode/i);
  });
});
