import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LoginPage } from "@/src/app/pages/login-page/LoginPage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

describe("LoginPage", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderLoginForm = () =>
    renderWithRouterAndI18n(LoginPage, { pathPattern: "/login" });

  it("renders project name and subtitle", async () => {
    await renderLoginForm();

    expect(
      screen.getByRole("heading", { name: PROJECT_INFORMATION.name }),
    ).toBeInTheDocument();

    expect(screen.getByText(PROJECT_INFORMATION.subtitle)).toBeInTheDocument();
  });

  it("renders the login form", async () => {
    await renderLoginForm();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders language select and theme toggle", async () => {
    await renderLoginForm();

    expect(
      screen.getByRole("combobox", { name: /Language/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Switch to dark/i }),
    ).toBeInTheDocument();
  });

  it("contains links to Terms of Service and Privacy Policy", async () => {
    await renderLoginForm();

    expect(
      screen.getByRole("link", { name: /terms of service/i }),
    ).toHaveAttribute("href", "/terms");

    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", "/privacypolicy");
  });

  it("shows skeletons while loading", async () => {
    setI18nLoading(true);
    await renderLoginForm();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
