import { InputField } from "@/src/shared/components/input-field/InputField";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("InputField", () => {
	const testOnChangeFn = vi.fn();
	const testPlaceHolder = 'Test Placeholder with numb3r5 4nd @#üöä"§$%';
	const testLabel = "مَرْحَبًا";
	const user = userEvent.setup();

	beforeEach(() => {
		testOnChangeFn.mockClear();
	});

	it("Renders an input field", () => {
		render(
			<InputField onInputValueChange={testOnChangeFn} label={testLabel} />,
		);
		expect(screen.getByRole("textbox")).toBeVisible();
		expect(screen.getAllByRole("textbox")).toHaveLength(1);
	});

	it("renders the given placeholder", () => {
		const { rerender } = render(
			<InputField
				onInputValueChange={testOnChangeFn}
				placeholder={testPlaceHolder}
				label={testLabel}
			/>,
		);

		expect(screen.getByPlaceholderText(testPlaceHolder)).toBeVisible();

		const anotherPlaceholder = "anotherPlawjefjsdjfholder";
		rerender(
			<InputField
				onInputValueChange={testOnChangeFn}
				placeholder={anotherPlaceholder}
				label={testLabel}
			/>,
		);
		expect(screen.getByPlaceholderText(anotherPlaceholder)).toBeVisible();
	});

	it("initially has empty value", () => {
		render(
			<InputField onInputValueChange={testOnChangeFn} label={testLabel} />,
		);
		expect(screen.getByRole("textbox")).toHaveValue("");
	});

	it("changes value according to what user does", async () => {
		render(
			<InputField onInputValueChange={testOnChangeFn} label={testLabel} />,
		);
		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("");

		const firstInputText = "hello there";
		await user.type(input, firstInputText);
		expect(input).toHaveValue(firstInputText);

		const moreInput = " hope you're do1ng we11";
		await user.type(input, moreInput);
		expect(input).toHaveValue(`${firstInputText}${moreInput}`);

		await user.type(input, "{BackSpace}");
		expect(input).toHaveValue(
			`${firstInputText}${moreInput.substring(0, moreInput.length - 1)}`,
		);

		await user.clear(input);
		expect(input).toHaveValue("");
	});

	it("does not render placeholder when it has a value", async () => {
		render(
			<InputField
				onInputValueChange={testOnChangeFn}
				placeholder={testPlaceHolder}
				label={testLabel}
			/>,
		);
		expect(screen.getByPlaceholderText(testPlaceHolder)).toBeVisible();

		const input = screen.getByRole("textbox");
		await user.type(input, "a");
		expect(screen.queryByText(testPlaceHolder)).not.toBeInTheDocument();
	});

	it("fires events whenever value of input changes", async () => {
		render(
			<InputField onInputValueChange={testOnChangeFn} label={testLabel} />,
		);
		expect(testOnChangeFn).toHaveBeenCalledTimes(0);

		const testingInput = "aüß@#;:_ثق٣";
		const input = screen.getByRole("textbox");
		await user.type(input, testingInput);
		expect(testOnChangeFn).toHaveBeenCalledTimes(testingInput.length);
		Array.from(testingInput).forEach((_, testingInputIndex) => {
			expect(testOnChangeFn).toHaveBeenCalledWith(
				testingInput.substring(0, testingInputIndex + 1),
			);
		});
	});

	it("user can focus input via tab key", async () => {
		render(
			<InputField onInputValueChange={testOnChangeFn} label={testLabel} />,
		);
		const input = screen.getByRole("textbox");
		expect(input).not.toHaveFocus();

		await user.tab();
		expect(input).toHaveFocus();

		await user.tab();
		expect(input).not.toHaveFocus();
	});

	it("input has proper label, which contains the given text", () => {
		render(
			<InputField onInputValueChange={testOnChangeFn} label={testLabel} />,
		);
		const input = screen.getByRole("textbox");
		expect(input).toHaveAccessibleName(testLabel);
	});
});
