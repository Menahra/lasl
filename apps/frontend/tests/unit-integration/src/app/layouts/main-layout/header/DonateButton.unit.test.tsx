import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DonateButton } from "@/src/app/layouts/main-layout/header/DonateButton.tsx";
import { renderWithI18n } from "@/tests/unit-integration/__wrappers__/I18nTestingWrapper.tsx";

describe("DonateButton", () => {
  const renderDonateButton = () => renderWithI18n(<DonateButton />);
  it("renders a link", () => {
    renderDonateButton();

    expect(screen.getByRole("link")).toBeVisible();
  });

  it("link points to ko-fi page", () => {
    renderDonateButton();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://ko-fi.com/zioui");
  });

  it("has proper aria label set", () => {
    renderDonateButton();

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(
      "Visit Ko-Fi to support this project with a donation.",
    );
  });

  it("shows proper tooltip on focus/hover", async () => {
    renderDonateButton();

    const user = userEvent.setup();

    await user.tab();
    expect(
      screen.getByRole("tooltip", {
        name: "Visit Ko-Fi to support this project with a donation.",
      }),
    ).toBeVisible();
  });
});
