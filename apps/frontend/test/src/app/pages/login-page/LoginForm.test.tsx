import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LoginForm } from "@/src/app/pages/login-page/LoginForm.tsx";
import { ROUTE_SIGN_UP } from "@/src/app/routes/_auth/register/index.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

describe("LoginForm", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderLoginForm = () =>
    renderWithProviders(LoginForm, {
      query: true,
      i18n: true,
      router: {
        pathPattern: "/login",
      },
    });

  it("renders title and subtitle", async () => {
    await renderLoginForm();

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to enhance your learning"),
    ).toBeInTheDocument();
  });

  it("renders email and password fields", async () => {
    await renderLoginForm();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders submit button", async () => {
    await renderLoginForm();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("renders sign up link with correct href", async () => {
    await renderLoginForm();
    const link = screen.getByRole("link", { name: /sign up/i });

    expect(link).toHaveAttribute("href", ROUTE_SIGN_UP);
  });

  it("shows skeletons when loading", async () => {
    setI18nLoading(true);
    await renderLoginForm();

    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });
});
