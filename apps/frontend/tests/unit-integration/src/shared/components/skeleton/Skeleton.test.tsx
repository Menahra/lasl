import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";

describe("Skeleton", () => {
  it("renders skeleton when loading is true", () => {
    render(
      <Skeleton loading={true} width={100} height={20}>
        <span>Content</span>
      </Skeleton>,
    );

    const skeleton = screen.getByText(
      (_, element) => element?.classList.contains("Skeleton") ?? false,
    );

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({
      width: "100px",
      height: "20px",
    });
  });

  it("does not render children when loading is true", () => {
    render(
      <Skeleton loading={true}>
        <span>Content</span>
      </Skeleton>,
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when loading is false", () => {
    render(
      <Skeleton loading={false}>
        <span>Loaded content</span>
      </Skeleton>,
    );

    expect(screen.getByText("Loaded content")).toBeInTheDocument();
  });

  it("renders nothing else when loading is false", () => {
    render(
      <Skeleton loading={false}>
        <div data-testid="child" />
      </Skeleton>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(
      screen.queryByText(
        (_, el) => el?.classList.contains("Skeleton") ?? false,
      ),
    ).not.toBeInTheDocument();
  });
});
