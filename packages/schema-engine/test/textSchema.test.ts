import {
	type MockInstance,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { validateSchema } from "../src/validator";
import { styleSchemaMock } from "./__mocks__/style.schema.mock";

describe("text json schema", () => {
	let consoleErrorSpy: MockInstance;

	beforeEach(() => {
		consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
	});

	afterEach(() => {
		consoleErrorSpy.mockReset();
	});

	const contentTestData = [
		{
			content: [
				{
					content: 17,
				},
			],
			valid: false,
		},
		{
			content: [
				{
					content: "17",
				},
			],
			valid: true,
		},
		{
			content: [
				{
					content: false, // boolean not allowed as content
				},
			],
			valid: false,
		},
		{
			content: [
				{
					content: ["hello"], // array not allowed as content
				},
			],
			valid: false,
		},
		{
			content: [
				{
					content: [12, false, "abc"],
				},
			],
			valid: false,
		},
		{
			content: [
				{
					content: "hello",
				},
				{
					content: "there",
				},
			],
			valid: true,
		},
		{
			content: [
				{
					content: "hello",
				},
				{
					content: 17,
				},
			],
			valid: false,
		},
		{
			content: [
				{
					content: {
						a: 123,
					},
				},
			],
			valid: false,
		},
	];
	it.each(contentTestData)(
		"properly validates text content to be of type string",
		({ content, valid }) => {
			expect(
				validateSchema(content, "http://example.com/text.schema.json"),
			).toEqual(valid);
		},
	);

	it("allows to add optional styling for the individual entries of text schema", () => {
		expect(
			validateSchema(
				[
					{
						content: "17",
						style: {
							"font-size": "17px",
						},
					},
					{
						content: "hello",
					},
					{
						content: "hello there",
						style: {
							"font-weight": "400",
						},
					},
					{
						content: "there",
					},
					{
						content: "test",
						style: styleSchemaMock,
					},
				],
				"http://example.com/text.schema.json",
			),
		).toEqual(true);
	});
});
