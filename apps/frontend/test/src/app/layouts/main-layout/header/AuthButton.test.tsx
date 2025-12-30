import { screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";
import { AuthButton } from "@/src/app/layouts/main-layout/header/AuthButton.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
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
    expect(link).toHaveAttribute("href", ROUTE_HOME);
  });
});
