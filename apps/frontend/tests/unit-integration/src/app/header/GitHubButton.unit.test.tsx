import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GitHubButton } from "@/src/layouts/main-layout/header/GitHubButton.tsx";

describe("GitHubButton", () => {
  it("renders a link", () => {
    render(<GitHubButton />);

    expect(screen.getByRole("link")).toBeVisible();
  });

  it("link points to ko-fi page", () => {
    render(<GitHubButton />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/Menahra/lasl");
  });

  it("has proper aria label set", () => {
    render(<GitHubButton />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("header.visit_github_repository");
  });

  it("shows proper tooltip on focus/hover", async () => {
    render(<GitHubButton />);

    const user = userEvent.setup();

    await user.tab();
    expect(
      screen.getByRole("tooltip", { name: "header.visit_github_repository" }),
    ).toBeVisible();
  });
});
