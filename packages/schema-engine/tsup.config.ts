import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/validator.ts"],
	splitting: false,
	minify: true,
	sourcemap: true,
	clean: true,
	format: ["esm"],
	dts: true,
});
