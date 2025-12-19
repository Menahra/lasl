import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RegisterForm } from "@/src/app/pages/register-page/RegisterForm.tsx";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

describe("RegisterForm", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderRegisterForm = () =>
    renderWithRouterAndI18n(RegisterForm, { pathPattern: "/signup" });

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

    expect(termsLink).toHaveAttribute("href", "/terms");
    expect(privacyLink).toHaveAttribute("href", "/privacypolicy");
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);
    await renderRegisterForm();

    expect(
      screen.queryByRole("button", { name: /create account/i }),
    ).not.toBeInTheDocument();
  });
});
