import { Tooltip } from "@/src/shared/components/tooltip/Tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Tooltip", () => {
	const user = userEvent.setup();
	it("per default renders the component that is given as child", () => {
		const testButtonText = "Hello I am the text of the button";
		render(
			<Tooltip>
				<button type="button">{testButtonText}</button>
			</Tooltip>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeVisible();
		expect(button).toHaveTextContent(testButtonText);
	});

	it("on hover shows the tooltip with the content that is provided", async () => {
		const testTooltipContent = "Hello I am the content of the tooltip";
		render(
			<Tooltip title={testTooltipContent}>
				<button type="button">Test</button>
			</Tooltip>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeVisible();
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

		await user.hover(button);
		expect(await screen.findByRole("tooltip")).toBeVisible();
	});

	it("after clicking the given child the tooltip disappears again", async () => {
		const testTooltipContent = "Hello I am the content of the tooltip";
		render(
			<Tooltip title={testTooltipContent}>
				<button type="button">Test</button>
			</Tooltip>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeVisible();
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

		await user.hover(button);
		expect(await screen.findByRole("tooltip")).toBeVisible();

		await user.click(button);
		await waitFor(() =>
			expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
		);
	});

	it("does not show any tooltip if no title prop is given", async () => {
		render(
			<Tooltip>
				<button type="button">Test</button>
			</Tooltip>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeVisible();
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

		vi.useFakeTimers({ shouldAdvanceTime: true });
		await user.hover(button);
		// Wait for 1 second and ensure the tooltip is not visible
		vi.advanceTimersByTime(1000);
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
		vi.useRealTimers();
	});

	it("shows tooltip on focus as well", async () => {
		render(
			<Tooltip title="some title">
				<button type="button">Test</button>
			</Tooltip>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeVisible();
		expect(button).not.toHaveFocus();
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

		await user.tab();
		expect(button).toHaveFocus();

		expect(await screen.findByRole("tooltip")).toBeVisible();
	});
});
