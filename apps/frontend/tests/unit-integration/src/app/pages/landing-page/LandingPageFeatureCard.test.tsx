import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  LandingPageFeatureCard,
  type LandingPageFeatureCardProps,
} from "@/src/app/pages/landing-page/LandingPageFeatureCard.tsx";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

describe("LandingPageFeatureCard", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderLandingPageFeatureCard = (props: LandingPageFeatureCardProps) =>
    renderWithProviders(() => <LandingPageFeatureCard {...props} />, {
      i18n: true,
    });

  it("renders icon, title and description when not loading", () => {
    renderLandingPageFeatureCard({
      icon: <span data-testid="icon">🔥</span>,
      title: "Fast setup",
      description: "Get started in minutes",
    });

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Fast setup" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Get started in minutes")).toBeInTheDocument();
  });

  it("hides all content when loading", () => {
    setI18nLoading(true);

    renderLandingPageFeatureCard({
      icon: <span>🔥</span>,
      title: "Fast setup",
      description: "Get started in minutes",
    });

    expect(screen.queryByText("🔥")).not.toBeInTheDocument();
    expect(screen.queryByText("Fast setup")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Get started in minutes"),
    ).not.toBeInTheDocument();
  });

  it("shows Coming Soon badge when planned is true", () => {
    renderLandingPageFeatureCard({
      planned: true,
      icon: <span>🔥</span>,
      title: "Advanced analytics",
      description: "Powerful insights",
    });

    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("does not show Coming Soon badge when planned is false", () => {
    renderLandingPageFeatureCard({
      icon: <span>🔥</span>,
      title: "Basic analytics",
      description: "Simple insights",
    });

    expect(screen.queryByText("Coming Soon")).not.toBeInTheDocument();
  });

  it("supports ReactNode props", () => {
    renderLandingPageFeatureCard({
      icon: <svg aria-label="feature icon" />,
      title: <span>Secure</span>,
      description: <strong>Enterprise-grade</strong>,
    });

    expect(screen.getByLabelText("feature icon")).toBeInTheDocument();
    expect(screen.getByText("Secure")).toBeInTheDocument();
    expect(screen.getByText("Enterprise-grade")).toBeInTheDocument();
  });

  it("does not expose interactive roles", () => {
    renderLandingPageFeatureCard({
      icon: <span>🔥</span>,
      title: "Feature",
      description: "Description",
    });

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
