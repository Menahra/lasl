import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResetPasswordPage } from "@/src/app/pages/reset-password/reset-password-page/ResetPasswordPage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

describe("ResetPasswordPage", () => {
  const renderResetPasswordPage = () =>
    renderWithProviders(ResetPasswordPage, {
      i18n: true,
      query: true,
      router: {
        pathPattern: "/reset",
      },
    });

  it("renders the reset password form", async () => {
    await renderResetPasswordPage();

    expect(
      screen.getByRole("heading", { name: /set new password/i }),
    ).toBeInTheDocument();
  });

  it("renders the project name and subtitle", async () => {
    await renderResetPasswordPage();

    expect(screen.getByText(PROJECT_INFORMATION.name)).toBeInTheDocument();

    expect(screen.getByText(PROJECT_INFORMATION.subtitle)).toBeInTheDocument();
  });

  it("renders language and theme controls", async () => {
    await renderResetPasswordPage();

    expect(
      screen.getByRole("combobox", { name: /language/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /dark mode/i }),
    ).toBeInTheDocument();
  });
});
