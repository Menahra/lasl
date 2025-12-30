import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResetPasswordSentPage } from "@/src/app/pages/reset-password/reset-password-sent-page/ResetPasswordSentPage.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

describe("ForgotPasswordSentPage", () => {
  afterEach(() => {
    setI18nLoading(false);
    vi.clearAllMocks();
  });

  const renderPage = () =>
    renderWithProviders(ResetPasswordSentPage, {
      i18n: true,
      router: {
        pathPattern: "/forgot-password/sent",
      },
    });

  it("renders title and description", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", { name: /password reset/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/successfully updated/i)).toBeInTheDocument();
  });

  it("renders back to sign in link", async () => {
    await renderPage();

    const link = screen.getByRole("link", {
      name: /sign in with new/i,
    });

    expect(link).toHaveAttribute("href", ROUTE_LOGIN);
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);

    await renderPage();

    expect(
      screen.queryByRole("heading", { name: /password reset/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: /sign in with new/i }),
    ).not.toBeInTheDocument();
  });
});
