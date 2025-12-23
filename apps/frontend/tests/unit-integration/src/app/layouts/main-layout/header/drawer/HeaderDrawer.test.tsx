import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderDrawer } from "@/src/app/layouts/main-layout/header/drawer/HeaderDrawer.tsx";
import {
  DONATE_PROJECT_LINK,
  GITHUB_PROJECT_LINK,
} from "@/src/shared/constants.ts";
import { renderWithI18n } from "@/tests/unit-integration/__wrappers__/I18nTestingWrapper.tsx";

describe("HeaderDrawer", () => {
  let searchValue = "";
  const setSearchValue = vi.fn((value: string) => {
    searchValue = value;
  });

  beforeEach(() => {
    searchValue = "";
    vi.clearAllMocks();
  });

  const renderDrawer = () =>
    renderWithI18n(
      <HeaderDrawer
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />,
    );

  const user = userEvent.setup();

  it("renders trigger button", () => {
    renderDrawer();
    const trigger = screen.getByRole("button", { name: /Open menu/i });
    expect(trigger).toBeInTheDocument();
  });

  it("opens and closes the drawer", async () => {
    renderDrawer();

    const trigger = screen.getByRole("button", { name: /open menu/i });
    await user.click(trigger);

    expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close menu/i });
    await user.click(closeButton);

    expect(
      screen.queryByRole("heading", { name: "Menu" }),
    ).not.toBeInTheDocument();
  });

  it("renders search input and updates value", async () => {
    renderDrawer();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();

    await user.type(input, "hello");
    expect(setSearchValue).toHaveBeenCalledTimes(5);
  });

  it("renders GitHub and Ko-Fi buttons with correct hrefs", async () => {
    renderDrawer();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const githubLink = screen.getByRole("link", {
      name: /View source code on GitHub/i,
    });
    expect(githubLink).toHaveAttribute("href", GITHUB_PROJECT_LINK);

    const kofiLink = screen.getByRole("link", {
      name: /Support this project on Ko-Fi/i,
    });
    expect(kofiLink).toHaveAttribute("href", DONATE_PROJECT_LINK);
  });

  it("renders the language select combobox", async () => {
    renderDrawer();
    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("combobox", { name: "Language" })).toBeVisible();
  });

  it("renders theme toggle button", async () => {
    renderDrawer();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const themeButton = screen.getByRole("button", { name: /Switch to dark/i });
    expect(themeButton).toBeInTheDocument();
  });
});
