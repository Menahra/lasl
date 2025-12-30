import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "@/src/shared/components/external-link/ExternalLink.tsx";

describe("ExternalLink", () => {
  it("renders children", () => {
    render(<ExternalLink href="https://example.com">Click me</ExternalLink>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("sets the href attribute", () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("has target _blank and rel noopener noreferrer", () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies optional props", () => {
    render(
      <ExternalLink
        href="https://example.com"
        className="my-class"
        aria-label="External site"
      >
        Link
      </ExternalLink>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveClass("my-class");
    expect(link).toHaveAttribute("aria-label", "External site");
  });
});
