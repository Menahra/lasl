import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImprintPage } from "@/src/app/pages/imprint-page/ImprintPage.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

vi.mock("@/src/app/layouts/main-layout/MainLayout.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: ok here
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

describe("ImprintPage", () => {
  const renderImprintPage = () =>
    renderWithRouterAndI18n(ImprintPage, { pathPattern: "/imprint" });

  it("renders the main layout", async () => {
    await renderImprintPage();
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders the imprint title", async () => {
    await renderImprintPage();
    expect(
      screen.getByRole("heading", { name: "Imprint", level: 1 }),
    ).toBeInTheDocument();
  });

  it("displays the last updated date", async () => {
    await renderImprintPage();
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
  });

  it("renders all imprint sections", async () => {
    await renderImprintPage();

    const sectionHeadlines = [
      "Service Provider",
      "Contact",
      "Responsible for Content",
      "Responsibility for Content",
      "Non-Commercial Notice",
      "Liability for Content",
      "Liability for Links",
      "Copyright",
    ];

    for (const sectionHeadline of sectionHeadlines) {
      expect(
        screen.getByRole("heading", { name: sectionHeadline, level: 2 }),
      ).toBeInTheDocument();
    }
  });

  it("displays the service provider name", async () => {
    await renderImprintPage();
    expect(
      screen.getAllByText(
        new RegExp(
          `${PROJECT_INFORMATION.author.firstName} ${PROJECT_INFORMATION.author.lastName}`,
        ),
      ).length,
    ).toBeGreaterThan(0);
  });

  it("mentions non-commercial operation", async () => {
    await renderImprintPage();
    expect(
      screen.getByText(/non-commercial hobby project/i),
    ).toBeInTheDocument();
  });

  it("has a link back to home", async () => {
    await renderImprintPage();
    const backLink = screen.getByText("Back to Home").closest("a");
    expect(backLink).toHaveAttribute("href", ROUTE_HOME);
  });
});
