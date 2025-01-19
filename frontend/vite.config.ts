/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [react(), tsconfigPaths(), svgr()],
	build: {
		sourcemap: true,
		rollupOptions: {
			external: ["tests/unit/**/*"],
		},
	},
	resolve: {
		alias: {
			"@styles": path.resolve(__dirname, "src/styles"),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler", // or "modern"
			},
		},
	},
	test: {
		environment: "happy-dom",
		globals: false,
		setupFiles: "./tests/unit/vitest.setup.ts",
	},
});
