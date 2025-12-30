import "@/test/__mocks__/i18nContextMock.ts";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LandingPageHighlightCard } from "@/src/app/pages/landing-page/LandingPageHighlightCard.tsx";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";

describe("LandingPageHighlightCard", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  it("renders title and description when not loading", () => {
    render(
      <LandingPageHighlightCard
        title="Fast setup"
        description="Get started in minutes"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 4, name: "Fast setup" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Get started in minutes")).toBeInTheDocument();
  });

  it("hides content when loading", () => {
    setI18nLoading(true);

    render(
      <LandingPageHighlightCard
        title="Fast setup"
        description="Get started in minutes"
      />,
    );

    expect(screen.queryByText("Fast setup")).not.toBeInTheDocument();

    expect(
      screen.queryByText("Get started in minutes"),
    ).not.toBeInTheDocument();
  });

  it("supports ReactNode content", () => {
    render(
      <LandingPageHighlightCard
        title={<span>Secure</span>}
        description={<strong>Enterprise-grade security</strong>}
      />,
    );

    expect(screen.getByText("Secure")).toBeInTheDocument();
    expect(screen.getByText("Enterprise-grade security")).toBeInTheDocument();
  });
});
