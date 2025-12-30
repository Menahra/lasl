import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RegisterSuccessPage } from "@/src/app/pages/register/register-success-page/RegisterSuccessPage.tsx";
import { ROUTE_SIGN_UP } from "@/src/app/routes/register/index.tsx";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

const renderPage = () =>
  renderWithProviders(RegisterSuccessPage, {
    query: true,
    i18n: true,
    router: {
      pathPattern: "/register/success",
    },
  });

describe("RegisterSuccessPage", () => {
  it("renders a success title", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("informs the user that registration was successful", async () => {
    await renderPage();
    expect(screen.getByText(/Check Your Email/i)).toBeInTheDocument();
  });

  it("provides a link to the login page", async () => {
    await renderPage();
    const loginLink = screen.getByRole("link", { name: /Registration/i });
    expect(loginLink).toHaveAttribute("href", ROUTE_SIGN_UP);
  });
});
