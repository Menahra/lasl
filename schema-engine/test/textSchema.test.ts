import { describe, expect, it } from "vitest";
import colorSchema from "../src/schema-definition/style.schema.json";
import { validateSchema } from "../src/validator";

describe("text json schema", () => {
	it("properly validates color", () => {
		expect(validateSchema(colorSchema, { bla: 3 })).toBeTruthy();
	});
});
