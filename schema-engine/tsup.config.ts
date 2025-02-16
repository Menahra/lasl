import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	splitting: false,
	minify: true,
	sourcemap: true,
	clean: true,
	format: ["cjs", "esm"],
	dts: true,
});
