import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TermsOfServicePage } from "@/src/app/pages/terms-of-service-page/TermsOfServicePage.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

vi.mock("@/src/app/layouts/main-layout/MainLayout.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: ok for mocking
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

const renderTermsOfServicePage = () =>
  renderWithProviders(TermsOfServicePage, {
    i18n: true,
    router: {
      pathPattern: "/terms",
    },
  });

describe("TermsOfServicePage", () => {
  it("renders the main layout", async () => {
    await renderTermsOfServicePage();
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders the page title", async () => {
    await renderTermsOfServicePage();
    expect(
      screen.getByRole("heading", { name: "Terms of Service", level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders the back to home button", async () => {
    await renderTermsOfServicePage();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("displays the last updated date", async () => {
    await renderTermsOfServicePage();
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("renders all main sections", async () => {
    await renderTermsOfServicePage();
    const sectionHeadlines = [
      "Service Provider",
      "Agreement to Terms",
      "Use License",
      "User Accounts",
      "Termination",
      "Intellectual Property",
      "Learning Content",
      "Limitation of Liability",
      "Consumer Rights",
      "Modifications",
      "Governing Law and Jurisdiction",
      "Privacy and Data Protection",
      "Contact Us",
    ];

    for (const sectionHeadline of sectionHeadlines) {
      expect(
        screen.getByRole("heading", { name: sectionHeadline, level: 2 }),
      ).toBeInTheDocument();
    }
  });

  it("displays service provider information", async () => {
    await renderTermsOfServicePage();
    expect(
      screen.getByText(
        new RegExp(
          `${PROJECT_INFORMATION.author.firstName} ${PROJECT_INFORMATION.author.lastName}`,
        ),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          `${PROJECT_INFORMATION.author.address.street} ${PROJECT_INFORMATION.author.address.housenumber}`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it("mentions the project name in multiple sections", async () => {
    await renderTermsOfServicePage();
    const projectNameMentions = screen.getAllByText(
      new RegExp(PROJECT_INFORMATION.name),
    );
    expect(projectNameMentions.length).toBeGreaterThan(1);
  });

  it("displays use license restrictions", async () => {
    await renderTermsOfServicePage();
    expect(
      screen.getByText(/Modify or copy the materials/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Use the materials for any commercial purpose/),
    ).toBeInTheDocument();
  });

  it("includes GDPR reference", async () => {
    await renderTermsOfServicePage();
    expect(
      screen.getByText(/General Data Protection Regulation/),
    ).toBeInTheDocument();
  });

  it("has a link back to home page", async () => {
    await renderTermsOfServicePage();
    const backLink = screen.getByText("Back to Home").closest("a");
    expect(backLink).toHaveAttribute("href", ROUTE_HOME);
  });
});
