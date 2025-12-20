import { screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";
import { AuthButton } from "@/src/app/layouts/main-layout/header/AuthButton.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";

vi.mock("@/src/shared/hooks/useAuthenticationContext.tsx", () => ({
  useAuthenticationContext: vi.fn(),
}));

import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

describe("AuthButton", () => {
  const renderAuthButton = () =>
    renderWithRouterAndI18n(AuthButton, { pathPattern: "/login" });

  it("renders login button linking to login page if user is not authenticated", async () => {
    (useAuthenticationContext as Mock).mockReturnValue({
      user: null,
    });

    await renderAuthButton();

    expect(screen.getByText(/login/i)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", ROUTE_LOGIN);
  });

  it("renders logout button linking to home if user is authenticated", async () => {
    (useAuthenticationContext as Mock).mockReturnValue({
      user: { id: "123", email: "test@example.com" },
    });

    await renderAuthButton();

    expect(screen.getByText(/logout/i)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });
});
