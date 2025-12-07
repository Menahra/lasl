import { defineConfig } from "@lingui/cli";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from './src/shared/constants.ts';

// biome-ignore lint/style/noDefaultExport: needed for lingui config
export default defineConfig({
  locales: AVAILABLE_LOCALES,
  sourceLocale: DEFAULT_LOCALE,
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
});