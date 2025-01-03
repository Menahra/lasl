import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "@/src/App";

describe("App", () => {
	it("renders App component", () => {
		render(<App />);

		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});
});
