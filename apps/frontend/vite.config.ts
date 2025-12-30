/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />

import process from "node:process";
import { lingui } from "@lingui/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: needed for vite(st) to work
export default defineConfig(() => {
  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "src/app/routes",
      }),
      react({
        babel: {
          plugins: ["@lingui/babel-plugin-lingui-macro"],
        },
      }),
      lingui(),
      tsconfigPaths(),
      svgr(),
    ],
    build: {
      sourcemap: true,
      rollupOptions: {
        external: ["test/**/*"],
      },
    },
    test: {
      environment: "happy-dom",
      globals: false,
      setupFiles: "./test/vitest.setup.ts",
      include: ["test/**/*.test.ts*"],
      coverage: {
        provider: "v8" as const,
        reporter: ["text", "lcov"],
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        // biome-ignore lint/complexity/useLiteralKeys: needed for typescript
        process.env["VITE_API_URL"] ?? "http://localhost:3000/api",
      ),
    },
  };
});
