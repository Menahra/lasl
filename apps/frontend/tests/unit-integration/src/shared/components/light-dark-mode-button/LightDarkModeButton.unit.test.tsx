import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { renderWithI18n } from "@/tests/unit-integration/__wrappers__/I18nTestingWrapper.tsx";

const useDarkModeMock = vi.hoisted(() => vi.fn());
vi.mock("@/src/shared/hooks/useDarkMode", () => ({
  useDarkMode: useDarkModeMock,
}));

describe("LightDarkModeButton", () => {
  const toDarkModeText = "Switch to dark mode";
  const toLightModeText = "Switch to light mode";
  const user = userEvent.setup();

  it("renders a button", () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: false,
      updateDarkModeSetting: vi.fn(),
    });
    renderWithI18n(<LightDarkModeButton />);

    expect(screen.getByRole("button")).toBeVisible();
  });

  it("if currently is light mode renders aria label and tooltip to switch to dark mode", async () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: false,
      updateDarkModeSetting: vi.fn(),
    });

    renderWithI18n(<LightDarkModeButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveAccessibleName(toDarkModeText);

    await user.tab();
    expect(screen.getByRole("tooltip", { name: toDarkModeText })).toBeVisible();
  });

  it("if currently is dark mode renders aria label and tooltip to switch to dark mode", async () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: true,
      updateDarkModeSetting: vi.fn(),
    });

    renderWithI18n(<LightDarkModeButton />);
    const button = screen.getByRole("button");
    expect(button).toHaveAccessibleName(toLightModeText);

    await user.tab();
    expect(
      screen.getByRole("tooltip", { name: toLightModeText }),
    ).toBeVisible();
  });

  it("calls update function onClick", async () => {
    const onClickFn = vi.fn();
    useDarkModeMock.mockReturnValue({
      isDarkMode: true,
      updateDarkModeSetting: onClickFn,
    });

    renderWithI18n(<LightDarkModeButton />);

    await user.tab();
    await user.keyboard(" ");
    expect(onClickFn).toHaveBeenCalledTimes(1);
  });
});
