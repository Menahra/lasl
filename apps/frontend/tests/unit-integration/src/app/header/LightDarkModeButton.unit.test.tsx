import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LightDarkModeButton } from "@/src/app/header/LightDarkModeButton.tsx";

const useDarkModeMock = vi.hoisted(() => vi.fn());
vi.mock("@/src/shared/hooks/useDarkMode", () => ({
  useDarkMode: useDarkModeMock,
}));

// biome-ignore lint/security/noSecrets: no secret
describe("LightDarkModeButton", () => {
  const toDarkModeText = "header.switch_to_darkmode";
  const toLightModeText = "header.switch_to_lightmode";
  const user = userEvent.setup();

  it("renders a button", () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: false,
      updateDarkModeSetting: vi.fn(),
    });
    render(<LightDarkModeButton />);

    expect(screen.getByRole("button")).toBeVisible();
  });

  it("if currently is light mode renders aria label and tooltip to switch to dark mode", async () => {
    useDarkModeMock.mockReturnValue({
      isDarkMode: false,
      updateDarkModeSetting: vi.fn(),
    });

    render(<LightDarkModeButton />);
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

    render(<LightDarkModeButton />);
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

    render(<LightDarkModeButton />);

    await user.tab();
    await user.keyboard(" ");
    expect(onClickFn).toHaveBeenCalledTimes(1);
  });
});
