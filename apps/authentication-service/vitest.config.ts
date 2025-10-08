import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: needed for vitest
export default defineConfig({
  test: {
    globalSetup: ["./test/__utils__/mongodb.setup.ts"],
    setupFiles: ["./test/__utils__/environment.setup.ts"],
  },
  resolve: {
    alias: {
      "@/src": new URL("./src/", import.meta.url).pathname,
      "@/test": new URL("./test/", import.meta.url).pathname,
    },
  },
  plugins: [swc.vite()],
});
