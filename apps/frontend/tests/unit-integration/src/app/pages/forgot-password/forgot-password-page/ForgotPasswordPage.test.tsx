import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ForgotPasswordPage } from "@/src/app/pages/forgot-password/forgot-password-page/ForgotPasswordPage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

describe("ForgotPasswordPage", () => {
  const renderForgotPasswordPage = () =>
    renderWithProviders(ForgotPasswordPage, {
      i18n: true,
      query: true,
      router: {
        pathPattern: "/forgot",
      },
    });

  it("renders the forgot password form", async () => {
    await renderForgotPasswordPage();

    expect(
      screen.getByRole("heading", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it("renders the project name and subtitle", async () => {
    await renderForgotPasswordPage();

    expect(screen.getByText(PROJECT_INFORMATION.name)).toBeInTheDocument();

    expect(screen.getByText(PROJECT_INFORMATION.subtitle)).toBeInTheDocument();
  });

  it("renders language and theme controls", async () => {
    await renderForgotPasswordPage();

    expect(
      screen.getByRole("combobox", { name: /language/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /dark mode/i }),
    ).toBeInTheDocument();
  });
});
