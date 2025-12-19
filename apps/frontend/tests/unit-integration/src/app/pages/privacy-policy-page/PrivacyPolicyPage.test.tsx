import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PrivacyPolicyPage } from "@/src/app/pages/privacy-policy-page/PrivacyPolicyPage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

vi.mock("@/src/app/layouts/main-layout/MainLayout.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: ok here
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

const renderPrivacyPolicyPage = () =>
  renderWithRouterAndI18n(PrivacyPolicyPage, { pathPattern: "/privacy" });

describe("PrivacyPolicyPage", () => {
  it("renders the main layout", async () => {
    await renderPrivacyPolicyPage();
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders the page title", async () => {
    await renderPrivacyPolicyPage();
    expect(
      screen.getByRole("heading", { name: "Privacy Policy", level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders the back to home button", async () => {
    await renderPrivacyPolicyPage();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("displays the last updated date", async () => {
    await renderPrivacyPolicyPage();
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("renders all main sections", async () => {
    await renderPrivacyPolicyPage();

    const sectionHeadlines = [
      "Introduction",
      "Data Controller",
      "Data We Collect",
      "Purposes of Processing",
      "Data Retention",
      "Data Sharing and Recipients",
      "International Data Transfers",
      "Data Security",
      "Your Rights",
      "Automated Decision-Making",
      "Contact",
    ];

    for (const sectionHeadline of sectionHeadlines) {
      expect(
        screen.getByRole("heading", { name: sectionHeadline, level: 2 }),
      ).toBeInTheDocument();
    }
  });

  it("displays data controller information", async () => {
    await renderPrivacyPolicyPage();

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

    expect(
      screen.getByText(new RegExp(PROJECT_INFORMATION.author.address.city)),
    ).toBeInTheDocument();
  });

  it("mentions the project name", async () => {
    await renderPrivacyPolicyPage();

    expect(
      screen.getByText(new RegExp(PROJECT_INFORMATION.name)),
    ).toBeInTheDocument();
  });

  it("mentions GDPR explicitly", async () => {
    await renderPrivacyPolicyPage();

    const article = screen.getByRole("article");
    expect(article).toHaveTextContent(
      /General Data Protection Regulation|GDPR/,
    );
  });

  it("lists user rights under GDPR", async () => {
    await renderPrivacyPolicyPage();

    expect(screen.getByText(/right to access/i)).toBeInTheDocument();
    expect(screen.getByText(/right to lodge a complaint/i)).toBeInTheDocument();
  });

  it("has a link back to home page", async () => {
    await renderPrivacyPolicyPage();

    const backLink = screen.getByText("Back to Home").closest("a");
    expect(backLink).toHaveAttribute("href", "/");
  });
});
