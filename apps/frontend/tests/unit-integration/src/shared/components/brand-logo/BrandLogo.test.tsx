import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { BrandLogo } from "@/src/shared/components/brand-logo/BrandLogo.tsx";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

describe("BrandLogo", () => {
  const renderBrandLogo = () =>
    renderWithRouterAndI18n(() => <BrandLogo variant="header" />, {
      pathPattern: "/someroute",
    });

  it("renders a link to the homepage", async () => {
    await renderBrandLogo();
    expect(
      screen.getByRole("link", { name: /go to homepage/i }),
    ).toHaveAttribute("href", ROUTE_HOME);
  });

  it("is accessible as a link", async () => {
    await renderBrandLogo();
    expect(
      screen.getByRole("link", { name: /go to homepage/i }),
    ).toBeInTheDocument();
  });
});
