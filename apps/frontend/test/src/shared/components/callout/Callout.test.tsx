import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Callout } from "@/src/shared/components/callout/Callout.tsx";
import {
  CALLOUT_SEVERITIES,
  CALLOUT_VARIANTS,
} from "@/src/shared/components/callout/calloutConfig.ts";

describe("Callout", () => {
  it("renders children", () => {
    render(<Callout>Test message</Callout>);

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("has role alert", () => {
    render(<Callout>Alert content</Callout>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("applies severity and variant classes", () => {
    render(
      <Callout severity="error" variant="filled">
        Error message
      </Callout>,
    );

    const callout = screen.getByRole("alert");

    expect(callout).toHaveClass("Callout");
    expect(callout).toHaveClass(CALLOUT_SEVERITIES.error.className);
    expect(callout).toHaveClass(CALLOUT_VARIANTS.filled);
  });

  it("renders the severity icon", () => {
    render(<Callout severity="success">Success</Callout>);

    // We don’t test the SVG itself, just that the icon container exists
    const iconContainer = document.querySelector(".CalloutIcon");
    expect(iconContainer).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided", () => {
    render(<Callout>Content</Callout>);

    expect(
      screen.queryByLabelText("Dismiss notification"),
    ).not.toBeInTheDocument();
  });

  it("renders close button when onClose is provided", () => {
    render(<Callout onClose={() => undefined}>Content</Callout>);

    expect(screen.getByLabelText("Dismiss notification")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();

    render(<Callout onClose={onClose}>Dismiss me</Callout>);

    fireEvent.click(screen.getByLabelText("Dismiss notification"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
