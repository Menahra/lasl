import { IconLink } from "@/src/shared/components/icon-link/IconLink";
import { PlusIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("IconLink", () => {
	const testHref = "test473";

	const user = userEvent.setup();
	it("renders an anchor", () => {
		render(<IconLink icon={<PlusIcon />} href={testHref} />);

		expect(screen.getByRole("link")).toBeVisible();
	});

	it("user can focus link by tabbing", async () => {
		render(<IconLink icon={<PlusIcon />} href={testHref} />);

		const link = screen.getByRole("link");
		expect(link).not.toHaveFocus();

		await user.tab();
		expect(link).toHaveFocus();
	});

	it("shows tooltip when prop is given", async () => {
		const testTitle = "I am a hover tooltip on an anchor";
		render(<IconLink icon={<PlusIcon />} href={testHref} title={testTitle} />);

		const link = screen.getByRole("link");
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

		await user.hover(link);
		expect(await screen.findByRole("tooltip")).toBeVisible();
	});

	it("link has href as given", () => {
		render(<IconLink icon={<PlusIcon />} href={testHref} />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", testHref);
	});
});
