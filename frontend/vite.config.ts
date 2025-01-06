/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	build: {
		sourcemap: true,
		rollupOptions: {
			external: ["tests/unit/**/*"],
		},
	},
	resolve: {
		alias: {
			'@styles': path.resolve(__dirname, 'src/styles')
		}
	},
	css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
	test: {
		environment: "happy-dom",
		globals: false,
		setupFiles: "./tests/unit/vitest.setup.ts",
	},
});
