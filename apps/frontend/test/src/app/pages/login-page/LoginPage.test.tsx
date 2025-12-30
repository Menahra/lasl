import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LoginPage } from "@/src/app/pages/login-page/LoginPage.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

describe("LoginPage", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderLoginPage = () =>
    renderWithProviders(LoginPage, {
      query: true,
      i18n: true,
      router: {
        pathPattern: "/login",
      },
    });

  it("renders project name and subtitle", async () => {
    await renderLoginPage();

    expect(
      screen.getByRole("heading", { name: PROJECT_INFORMATION.name }),
    ).toBeInTheDocument();

    expect(screen.getByText(PROJECT_INFORMATION.subtitle)).toBeInTheDocument();
  });

  it("renders the login form", async () => {
    await renderLoginPage();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders language select and theme toggle", async () => {
    await renderLoginPage();

    expect(
      screen.getByRole("combobox", { name: /Language/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Switch to dark/i }),
    ).toBeInTheDocument();
  });

  it("contains links to Terms of Service and Privacy Policy", async () => {
    await renderLoginPage();

    expect(
      screen.getByRole("link", { name: /terms of service/i }),
    ).toHaveAttribute("href", ROUTE_TERMS_OF_SERVICE);

    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", ROUTE_PRIVACY_POLICY);
  });

  it("shows skeletons while loading", async () => {
    setI18nLoading(true);
    await renderLoginPage();

    expect(screen.getAllByRole("link").length).toBeLessThan(2);
  });
});
