import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  LegalDocumentLayout,
  type LegalDocumentLayoutProps,
} from "@/src/app/layouts/legal-document-layout/LegalDocumentLayout.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

vi.mock("@/src/app/layouts/main-layout/MainLayout.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: ok here
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

const renderLegalDocumentLayout = (props: LegalDocumentLayoutProps) =>
  renderWithRouterAndI18n(() => <LegalDocumentLayout {...props} />, {
    pathPattern: "/legal-doc",
  });

describe("LegalDocumentLayout", () => {
  const lastUpdate = new Date("2025-01-01");
  const testTitle = "Privacy Policy";

  it("renders the document title", async () => {
    await renderLegalDocumentLayout({ title: testTitle, lastUpdate });

    expect(
      screen.getByRole("heading", { level: 1, name: testTitle }),
    ).toBeInTheDocument();
  });

  it("renders the last updated date", async () => {
    await renderLegalDocumentLayout({ title: testTitle, lastUpdate });

    expect(screen.getByText(/last updated:/i)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(lastUpdate.getFullYear().toString())),
    ).toBeInTheDocument();
  });

  it("renders children content", async () => {
    await renderLegalDocumentLayout({
      title: testTitle,
      lastUpdate,
      children: "Document content",
    });

    expect(screen.getByText("Document content")).toBeInTheDocument();
  });

  it("renders a back to home link", async () => {
    await renderLegalDocumentLayout({ title: testTitle, lastUpdate });

    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toHaveAttribute("href", ROUTE_HOME);
  });

  it("wraps content in MainLayout", async () => {
    await renderLegalDocumentLayout({ title: testTitle, lastUpdate });

    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });
});
