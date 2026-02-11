import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@lasl/app-contracts/locales";
import { defineConfig } from "@lingui/cli";

// biome-ignore lint/style/noDefaultExport: needed for lingui config
export default defineConfig({
  locales: [...SUPPORTED_LOCALES],
  sourceLocale: DEFAULT_LOCALE,
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
});
