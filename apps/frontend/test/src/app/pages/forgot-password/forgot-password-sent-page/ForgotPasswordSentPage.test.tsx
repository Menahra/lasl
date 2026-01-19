import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordSentPage } from "@/src/app/pages/forgot-password/forgot-password-sent-page/ForgotPasswordSentPage.tsx";
import { ROUTE_FORGOT_PASSWORD } from "@/src/app/routes/_auth/forgot-password/index.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/_auth/login.tsx";
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

describe("ForgotPasswordSentPage", () => {
  afterEach(() => {
    setI18nLoading(false);
    mockLocationState = undefined;
    vi.clearAllMocks();
  });

  const renderPage = () =>
    renderWithProviders(ForgotPasswordSentPage, {
      i18n: true,
      router: {
        pathPattern: "/forgot-password/sent",
      },
    });

  it("renders title and description", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/we have sent password reset instructions/i),
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
        /if an account exists for your email, we have sent password reset instructions/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders try another email link", async () => {
    await renderPage();

    const link = screen.getByRole("link", {
      name: /try another email/i,
    });

    expect(link).toHaveAttribute("href", ROUTE_FORGOT_PASSWORD);
  });

  it("renders back to sign in link", async () => {
    await renderPage();

    const link = screen.getByRole("link", {
      name: /back to sign in/i,
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
