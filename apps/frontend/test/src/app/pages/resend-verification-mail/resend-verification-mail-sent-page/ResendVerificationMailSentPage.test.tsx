import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResendVerificationMailSentPage } from "@/src/app/pages/resend-verification-mail/resend-verification-mail-sent-page/ResendVerificationMailSentPage.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { ROUTE_RESEND_VERIFICATION_MAIL } from "@/src/app/routes/resend-verification-mail/index.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

let mockLocationState: unknown;

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();

  return {
    ...actual,
    useRouterState: () => ({
      location: {
        state: mockLocationState,
      },
    }),
  };
});

describe("ResendVerificationMailSentPage", () => {
  afterEach(() => {
    setI18nLoading(false);
    mockLocationState = undefined;
    vi.clearAllMocks();
  });

  const renderPage = () =>
    renderWithProviders(ResendVerificationMailSentPage, {
      i18n: true,
      router: {
        pathPattern: "/resend-verification-mail/sent",
      },
    });

  it("renders title and description", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/if an account exists for your/i),
    ).toBeInTheDocument();
  });

  it("renders email from router state when provided", async () => {
    mockLocationState = { email: "student@example.com" };

    await renderPage();

    expect(screen.getByText(/student@example.com/i)).toBeInTheDocument();
  });

  it("falls back to generic email text when no email is provided", async () => {
    await renderPage();

    expect(
      screen.getByText(
        /if an account exists for your email address, we have sent a new verification/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders try another email link", async () => {
    await renderPage();

    const link = screen.getByRole("link", {
      name: /send to a different email/i,
    });

    expect(link).toHaveAttribute("href", ROUTE_RESEND_VERIFICATION_MAIL);
  });

  it("renders back to sign in link", async () => {
    await renderPage();

    const link = screen.getByRole("link", {
      name: /back to login/i,
    });

    expect(link).toHaveAttribute("href", ROUTE_LOGIN);
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);

    await renderPage();

    expect(
      screen.queryByRole("heading", { name: /check your email/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: /try another email/i }),
    ).not.toBeInTheDocument();
  });
});
