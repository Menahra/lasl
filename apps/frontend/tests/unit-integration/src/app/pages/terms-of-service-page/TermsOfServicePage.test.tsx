import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TermsOfServicePage } from "@/src/app/pages/terms-of-service-page/TermsOfServicePage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

vi.mock("@/src/app/layouts/main-layout/MainLayout.tsx", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

const renderTermsOfServicePage = () =>
  renderWithRouterAndI18n(TermsOfServicePage, { pathPattern: "/terms" });

describe("TermsOfServicePage", () => {
  it("renders the main layout", async () => {
    await renderTermsOfServicePage();
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders the page title", async () => {
    await renderTermsOfServicePage();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
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

    expect(screen.getByText("Service Provider")).toBeInTheDocument();
    expect(screen.getByText("Agreement to Terms")).toBeInTheDocument();
    expect(screen.getByText("Use License")).toBeInTheDocument();
    expect(screen.getByText("User Accounts")).toBeInTheDocument();
    expect(screen.getByText("Termination")).toBeInTheDocument();
    expect(screen.getByText("Intellectual Property")).toBeInTheDocument();
    expect(screen.getByText("Learning Content")).toBeInTheDocument();
    expect(screen.getByText("Limitation of Liability")).toBeInTheDocument();
    expect(screen.getByText("Consumer Rights")).toBeInTheDocument();
    expect(screen.getByText("Modifications")).toBeInTheDocument();
    expect(
      screen.getByText("Governing Law and Jurisdiction"),
    ).toBeInTheDocument();
    expect(screen.getByText("Privacy and Data Protection")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
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
    expect(backLink).toHaveAttribute("href", "/");
  });
});
