import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

const useDarkModeMock = vi.hoisted(() => vi.fn());
vi.mock("@/src/shared/hooks/useDarkMode", () => ({
  useDarkMode: useDarkModeMock,
}));

describe("LightDarkModeButton", () => {
  const toDarkModeText = "Switch to dark mode";
  const toLightModeText = "Switch to light mode";
  const user = userEvent.setup();

  const renderLightDarkModeButton = () =>
    renderWithProviders(LightDarkModeButton, {
      i18n: true,
    });

  it("renders a button", () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: false,
      updateDarkModeSetting: vi.fn(),
    });
    renderLightDarkModeButton();

    expect(screen.getByRole("button")).toBeVisible();
  });

  it("if currently is light mode renders aria label and tooltip to switch to dark mode", async () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: false,
      updateDarkModeSetting: vi.fn(),
    });

    renderLightDarkModeButton();
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

    renderLightDarkModeButton();
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

    renderLightDarkModeButton();

    await user.tab();
    await user.keyboard(" ");
    expect(onClickFn).toHaveBeenCalledTimes(1);
  });
});
