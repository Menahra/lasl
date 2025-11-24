import { defineConfig } from "@lingui/cli";

// biome-ignore lint/style/noDefaultExport: needed for lingui config
export default defineConfig({
  locales: ["en", "de", "fr"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
});