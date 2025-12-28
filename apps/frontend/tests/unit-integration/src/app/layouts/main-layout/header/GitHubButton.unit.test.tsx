import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GitHubButton } from "@/src/app/layouts/main-layout/header/GitHubButton.tsx";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

describe("GitHubButton", () => {
  const renderGitHubButton = () =>
    renderWithProviders(GitHubButton, {
      i18n: true,
    });

  it("renders a link", () => {
    renderGitHubButton();

    expect(screen.getByRole("link")).toBeVisible();
  });

  it("link points to ko-fi page", () => {
    renderGitHubButton();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/Menahra/lasl");
  });

  it("has proper aria label set", () => {
    renderGitHubButton();

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(
      "Open the GitHub repository in a new browser tab.",
    );
  });

  it("shows proper tooltip on focus/hover", async () => {
    renderGitHubButton();

    const user = userEvent.setup();

    await user.tab();
    expect(
      screen.getByRole("tooltip", {
        name: "Open the GitHub repository in a new browser tab.",
      }),
    ).toBeVisible();
  });
});
