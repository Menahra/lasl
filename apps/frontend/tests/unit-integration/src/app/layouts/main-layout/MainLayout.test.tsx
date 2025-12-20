import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MainLayout } from "@/src/app/layouts/main-layout/MainLayout.tsx";

vi.mock("@/src/app/layouts/main-layout/header/Header.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: ok here
  Header: () => <div data-testid="header" />,
}));

vi.mock("@/src/app/layouts/main-layout/footer/Footer.tsx", () => ({
  // biome-ignore lint/style/useNamingConvention: ok here
  Footer: () => <div data-testid="footer" />,
}));

describe("MainLayout", () => {
  it("renders the header", () => {
    render(
      <MainLayout>
        <div />
      </MainLayout>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(
      <MainLayout>
        <div />
      </MainLayout>,
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders children inside the main content area", () => {
    render(
      <MainLayout>
        <div data-testid="page-content">Hello</div>
      </MainLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("page-content"));
  });

  it("exposes a main landmark for accessibility", () => {
    render(
      <MainLayout>
        <div />
      </MainLayout>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
