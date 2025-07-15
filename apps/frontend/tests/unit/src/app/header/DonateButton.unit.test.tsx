import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DonateButton } from "@/src/app/header/DonateButton";

describe("DonateButton", () => {
  it("renders a link", () => {
    render(<DonateButton />);

    expect(screen.getByRole("link")).toBeVisible();
  });

  it("link points to ko-fi page", () => {
    render(<DonateButton />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://ko-fi.com/zioui");
  });

  it("has proper aria label set", () => {
    render(<DonateButton />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("header.ko-fi_donate_description");
  });

  it("shows proper tooltip on focus/hover", async () => {
    render(<DonateButton />);

    const user = userEvent.setup();

    await user.tab();
    expect(
      screen.getByRole("tooltip", { name: "header.ko-fi_donate_description" }),
    ).toBeVisible();
  });
});
