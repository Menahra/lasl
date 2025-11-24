/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />

import process from "node:process";
import { lingui } from "@lingui/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: needed for vite(st) to work
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // biome-ignore lint/complexity/useLiteralKeys: needed for typescript
  const isTestMode = mode === "test" || process.env["VITEST"];
  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
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
        external: ["tests/unit-integration/**/*"],
      },
    },
    test: {
      environment: "happy-dom",
      globals: false,
      setupFiles: "./tests/unit-integration/vitest.setup.ts",
      include: ["tests/unit-integration/**/*.test.ts*"],
      coverage: {
        provider: "v8" as const,
        reporter: ["text", "lcov"],
      },
    },
    define: isTestMode
      ? {
          "import.meta.env.VITE_API_URL": JSON.stringify(
            // biome-ignore lint/complexity/useLiteralKeys: needed for typescript
            env["VITE_API_URL"] ?? "http://localhost:3000/api",
          ),
        }
      : {},
  };
});
