import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: needed for vitest
export default defineConfig({
  resolve: {
    alias: {
      "@/src": new URL("./src/", import.meta.url).pathname,
    },
  },
});
