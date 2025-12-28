import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RegisterForm } from "@/src/app/pages/register-page/RegisterForm.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

describe("RegisterForm", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderRegisterForm = () =>
    renderWithProviders(RegisterForm, {
      query: true,
      i18n: true,
      router: {
        pathPattern: "/signup",
      },
    });

  it("renders all input fields", async () => {
    await renderRegisterForm();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders submit button", async () => {
    await renderRegisterForm();

    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("renders legal agreement links", async () => {
    await renderRegisterForm();

    const termsLink = screen.getByRole("link", {
      name: /terms of service/i,
    });

    const privacyLink = screen.getByRole("link", {
      name: /privacy policy/i,
    });

    expect(termsLink).toHaveAttribute("href", ROUTE_TERMS_OF_SERVICE);
    expect(privacyLink).toHaveAttribute("href", ROUTE_PRIVACY_POLICY);
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);
    await renderRegisterForm();

    expect(
      screen.queryByRole("button", { name: /create account/i }),
    ).not.toBeInTheDocument();
  });
});
