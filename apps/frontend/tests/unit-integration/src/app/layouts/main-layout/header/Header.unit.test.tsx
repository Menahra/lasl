<<<<<<< HEAD
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
=======
import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
>>>>>>> f22d991 (chore: adjust tests to changes)
import { Header } from "@/src/app/layouts/main-layout/header/Header.tsx";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { mockMatchMedia } from "@/tests/unit-integration/__mocks__/matchMediaMock.ts";
import { renderWithI18n } from "@/tests/unit-integration/__wrappers__/I18nTestingWrapper.tsx";

describe("Header", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    setI18nLoading(false);
  });

  const renderHeader = () => renderWithI18n(<Header />);
  const user = userEvent.setup();

  it("renders a search field (among other things)", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    renderHeader();

    expect(screen.getByRole("textbox")).toBeVisible();
  });

  it("per default search field has no value", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    renderHeader();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("search field has proper aria label and placeholder", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    renderHeader();
    const searchField = screen.getByRole("textbox");
    expect(searchField).toHaveAccessibleName("Search in all pages");
    expect(searchField).toHaveAttribute("placeholder", "Search...");
  });

  it("renders two links one for github and one for ko-fi", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
    });
    renderHeader();
    expect(screen.getAllByRole("link")).toHaveLength(2);

    ["github", "ko-fi"].forEach((link, index) => {
      expect(
        (screen.getAllByRole("link")[index] as HTMLAnchorElement).href,
      ).toContain(link);
    });
  });

  it("renders a button to change theme to light if current is dark", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
      "(prefers-color-scheme: dark)": true,
    });
    renderHeader();
    const button = screen.getByRole("button");
    expect(button).toBeVisible();

<<<<<<< HEAD
    expect(button).toHaveAccessibleName("header.switch_to_light_mode");
=======
    expect(button).toHaveAccessibleName("Switch to light mode");
>>>>>>> f22d991 (chore: adjust tests to changes)
  });

  it("renders a button to change theme to dark if current is light", () => {
    mockMatchMedia({
      "(min-width: 768px)": true,
      "(prefers-color-scheme: dark)": false,
    });
    renderHeader();
    const button = screen.getByRole("button");
    expect(button).toBeVisible();

<<<<<<< HEAD
    expect(button).toHaveAccessibleName("header.switch_to_dark_mode");
=======
    expect(button).toHaveAccessibleName("Switch to dark mode");
>>>>>>> f22d991 (chore: adjust tests to changes)
  });

  it("renders LanguageSelect in desktop view", () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    renderHeader();
    expect(screen.getByRole("combobox", { name: "Language" })).toBeVisible();
  });

  it("shows skeleton for search input when loading", () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    setI18nLoading(true);

    renderHeader();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("renders HeaderDrawer on mobile instead of inline search/buttons", () => {
    mockMatchMedia({ "(min-width: 768px)": false });
    renderHeader();
    expect(screen.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  it("updates search value when typing", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    renderHeader();
    const input = screen.getByRole("textbox");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("toggles theme when LightDarkModeButton is clicked", async () => {
    mockMatchMedia({ "(min-width: 768px)": true });
    renderHeader();
    const button = screen.getByRole("button", {
      name: /Switch to dark|light mode/i,
    });
    await user.click(button);
    expect(button).toHaveAccessibleName(/Switch to dark|light mode/i);
  });
});
