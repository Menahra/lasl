import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";

/* mock tanstack router link */
vi.mock("@tanstack/react-router", async (importOriginalRouter) => {
  const actual =
    await importOriginalRouter<typeof import("@tanstack/react-router")>();

  return {
    ...actual,
    // biome-ignore lint/style/useNamingConvention: given by tanstack
    Link: ({
      to,
      children,
      className,
    }: PropsWithChildren<{ to: string; className: string }>) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  };
});

describe("TextLink", () => {
  it("renders link text", () => {
    render(
      <TextLink variant="primary" to="/home">
        Go home
      </TextLink>,
    );

    expect(screen.getByText("Go home")).toBeInTheDocument();
  });

  it("renders as a link with correct href", () => {
    render(
      <TextLink variant="primary" to="/about">
        About
      </TextLink>,
    );

    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
  });

  it("applies base TextLink class", () => {
    render(
      <TextLink variant="primary" to="/">
        Home
      </TextLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("TextLink");
  });

  it("applies primary variant class", () => {
    render(
      <TextLink variant="primary" to="/">
        Home
      </TextLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("TextLink--primay");
  });

  it("applies accent variant class", () => {
    render(
      <TextLink variant="accent" to="/">
        Accent link
      </TextLink>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("TextLink--accent");
  });
});
