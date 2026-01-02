import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { AuthButton } from "@/src/app/layouts/main-layout/header/AuthButton.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

vi.mock("@/src/shared/hooks/useAuthenticationContext.tsx", () => ({
  useAuthenticationContext: vi.fn(),
}));

import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";

describe("AuthButton", () => {
  const renderAuthButton = () =>
    renderWithProviders(AuthButton, {
      i18n: true,
      router: {
        pathPattern: "/login",
      },
    });

  beforeEach(() => setI18nLoading(false));

  it("renders login button linking to login page if user is not authenticated", async () => {
    (useAuthenticationContext as Mock).mockReturnValue({
      user: null,
    });

    await renderAuthButton();

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", ROUTE_LOGIN);
  });

  it("renders logout button linking to home if user is authenticated", async () => {
    (useAuthenticationContext as Mock).mockReturnValue({
      user: { id: "123", email: "test@example.com" },
    });

    await renderAuthButton();

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", ROUTE_HOME);
  });

  it("renders no button if i18n is loading", async () => {
    setI18nLoading(true);
    await renderAuthButton();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
