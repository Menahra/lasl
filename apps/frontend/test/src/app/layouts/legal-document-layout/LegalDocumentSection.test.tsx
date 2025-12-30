import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LegalDocumentSection } from "@/src/app/layouts/legal-document-layout/LegalDocumentSection.tsx";

describe("LegalDocumentSection", () => {
  it("renders the section title", () => {
    render(
      <LegalDocumentSection title="Section Title">
        <p>Content</p>
      </LegalDocumentSection>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Section Title" }),
    ).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <LegalDocumentSection title="Title">
        <p>Child content</p>
      </LegalDocumentSection>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("wraps content in a section element", () => {
    const { container } = render(
      <LegalDocumentSection title="Title">
        <p>Content</p>
      </LegalDocumentSection>,
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("supports ReactNode titles", () => {
    render(
      <LegalDocumentSection
        title={<span data-testid="custom-title">Custom Title</span>}
      >
        <p>Content</p>
      </LegalDocumentSection>,
    );

    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });
});
