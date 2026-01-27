import process from "node:process";
import { BYPASS_RATE_LIMIT_HEADER_NAME } from "@lasl/app-contracts/api/headers";
import { defineConfig, devices } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

// biome-ignore lint/style/noDefaultExport: ok in config
export default defineConfig({
  testDir: "./tests",

  timeout: 30 * 1000,

  fullyParallel: false, // Set to false initially for auth flows

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  reporter: [["html"], ["list"]],

  use: {
    // biome-ignore-start lint/style/useNamingConvention: given name
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    extraHTTPHeaders: {
      [BYPASS_RATE_LIMIT_HEADER_NAME]:
        process.env.AUTHENTICATION_RATELIMIT_BYPASS_KEY || "",
    },
    // biome-ignore-end lint/style/useNamingConvention: given name

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
