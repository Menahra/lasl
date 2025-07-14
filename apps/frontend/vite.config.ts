/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />

// biome-ignore lint/correctness/noNodejsModules: this is running in node env
import path from "node:path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: needed for vite(st) to work
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
    include: ["tests/unit/**/*.test.ts*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
