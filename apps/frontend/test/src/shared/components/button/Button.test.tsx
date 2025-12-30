import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/src/shared/components/button/Button.tsx";

describe("Button", () => {
  const user = userEvent.setup();

  it("renders children", () => {
    render(<Button onClick={vi.fn()}>Click me</Button>);

    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an icon when startIcon is provided", () => {
    render(
      <Button onClick={vi.fn()} startIcon={<span data-testid="icon" />}>
        Click
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders an icon when endIcon is provided", () => {
    render(
      <Button onClick={vi.fn()} endIcon={<span data-testid="icon" />}>
        Click
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies the correct variant class", () => {
    render(
      <Button onClick={vi.fn()} variant="secondary">
        Click
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveClass("Button--secondary");
  });

  it("applies fullWidth class when fullWidth is true", () => {
    render(
      <Button onClick={vi.fn()} fullWidth={true}>
        Click
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveClass("Button--fullWidth");
  });

  it("passes the type attribute", () => {
    render(
      <Button onClick={vi.fn()} type="submit">
        Submit
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("is disabled when loading", () => {
    render(<Button loading={true}>Click</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not call onClick when loading", async () => {
    const onClick = vi.fn();

    render(
      <Button loading={true} onClick={onClick}>
        Click
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps button text visible while loading", () => {
    render(<Button loading={true}>Click</Button>);

    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("sets aria-busy when loading", () => {
    render(<Button loading={true}>Click</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });
});
