/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	build: {
		sourcemap: true,
		rollupOptions: {
			external: ["tests/unit/**/*"],
		},
	},
	test: {
		environment: "happy-dom",
		globals: false,
		setupFiles: "./tests/unit/vitest.setup.ts",
	},
});
