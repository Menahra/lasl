import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "@/src/shared/components/icon-button/IconButton";

describe("IconButton", () => {
  const testDescription = "some useful aria label";
  const testIcon = <MagnifyingGlassIcon />;
  const testOnClickFn = vi.fn();

  const user = userEvent.setup();

  it("renders a button", () => {
    render(
      <IconButton
        description={testDescription}
        icon={testIcon}
        onClick={testOnClickFn}
      />,
    );

    expect(screen.getByRole("button")).toBeVisible();
  });

  it("calls onClick when button is clicked", async () => {
    render(
      <IconButton
        description={testDescription}
        icon={testIcon}
        onClick={testOnClickFn}
      />,
    );

    const button = screen.getByRole("button");
    expect(testOnClickFn).toHaveBeenCalledTimes(0);
    await user.click(button);
    expect(testOnClickFn).toHaveBeenCalledTimes(1);

    testOnClickFn.mockClear();
  });

  it("shows tooltip on hover, when prop is given", async () => {
    const testTitle = "I am a tooltip text that will show on hover";
    render(
      <IconButton
        description={testDescription}
        icon={testIcon}
        onClick={testOnClickFn}
        title={testTitle}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(button);
    expect(await screen.findByRole("tooltip")).toBeVisible();
  });

  it("button has provided description", () => {
    render(
      <IconButton
        description={testDescription}
        icon={testIcon}
        onClick={testOnClickFn}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAccessibleName(testDescription);
  });

  it("user can operate icon button via keyboard", async () => {
    const testTitle = "I am a tooltip text that will show on hover";
    render(
      <IconButton
        description={testDescription}
        icon={testIcon}
        onClick={testOnClickFn}
        title={testTitle}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).not.toHaveFocus();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.tab();
    expect(button).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeVisible();

    expect(testOnClickFn).toHaveBeenCalledTimes(0);
    await user.keyboard(" ");
    expect(testOnClickFn).toHaveBeenCalledTimes(1);
    await user.keyboard("{Enter}");
    expect(testOnClickFn).toHaveBeenCalledTimes(2);
  });
});
