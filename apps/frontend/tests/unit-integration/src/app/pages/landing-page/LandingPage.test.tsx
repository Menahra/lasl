import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LandingPage } from "@/src/app/pages/landing-page/LandingPage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

vi.mock("@/src/shared/hooks/useAuthenticationContext.tsx", () => ({
  useAuthenticationContext: () => ({}),
}));

describe("LandingPage", () => {
  const renderLandingPage = () =>
    renderWithProviders(LandingPage, {
      i18n: true,
      router: {
        pathPattern: "/test",
      },
    });

  it("renders without crashing", async () => {
    await renderLandingPage();

    expect(screen.getByText(/master classical arabic/i)).toBeInTheDocument();
  });

  it("renders the main project goal text", async () => {
    await renderLandingPage();

    expect(
      screen.getByText(/open, community-driven platform/i),
    ).toBeInTheDocument();
  });

  it("renders primary call-to-action buttons", async () => {
    await renderLandingPage();

    expect(
      screen.getByRole("button", { name: /start learning free/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("renders learning highlights", async () => {
    await renderLandingPage();

    expect(screen.getAllByText(/nahw/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/sarf/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/balagha/i).length).toBeGreaterThan(0);
  });

  it("mentions the project name in motivation section", async () => {
    await renderLandingPage();

    expect(
      screen.getByText(new RegExp(`why\\s+${PROJECT_INFORMATION.name}`, "i")),
    ).toBeInTheDocument();
  });

  it("renders feature cards", async () => {
    await renderLandingPage();

    expect(screen.getByText(/structured curriculum/i)).toBeInTheDocument();

    expect(screen.getByText(/community-driven content/i)).toBeInTheDocument();

    expect(screen.getByText(/accessible everywhere/i)).toBeInTheDocument();
  });

  it("renders final call to action section", async () => {
    await renderLandingPage();

    expect(
      screen.getByText(/ready to begin your arabic journey/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create your free account/i }),
    ).toBeInTheDocument();
  });
});
