import "@/test/__mocks__/i18nContextMock.ts";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Footer } from "@/src/app/layouts/main-layout/footer/Footer.tsx";
import { ROUTE_IMPRINT } from "@/src/app/routes/imprint.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { setI18nLoading } from "@/test/__mocks__/i18nContextMock.ts";
import { renderWithProviders } from "@/test/__wrappers__/renderWithProviders.tsx";

describe("Footer", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderFooter = () =>
    renderWithProviders(Footer, {
      i18n: true,
      router: {
        pathPattern: "/footer",
      },
    });

  it("renders the footer element", async () => {
    await renderFooter();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("displays the project name", async () => {
    await renderFooter();
    expect(
      screen.getAllByText(PROJECT_INFORMATION.name)[0],
    ).toBeInTheDocument();
  });

  it("renders legal section links", async () => {
    await renderFooter();

    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", ROUTE_PRIVACY_POLICY);

    expect(
      screen.getByRole("link", { name: /terms of service/i }),
    ).toHaveAttribute("href", ROUTE_TERMS_OF_SERVICE);

    expect(screen.getByRole("link", { name: /imprint/i })).toHaveAttribute(
      "href",
      ROUTE_IMPRINT,
    );
  });

  it("renders section headings", async () => {
    await renderFooter();

    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
  });

  it("renders current year in copyright notice", async () => {
    await renderFooter();

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });

  it("renders the brand logo as a home link", async () => {
    await renderFooter();

    const logoLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === ROUTE_HOME);

    expect(logoLink).toBeTruthy();
  });

  it("renders only logo link if i18n is loading", async () => {
    setI18nLoading(true);
    await renderFooter();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});
