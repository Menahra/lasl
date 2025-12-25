import { defineConfig } from "tsup";

// biome-ignore lint/style/noDefaultExport: needed for tsup
export default defineConfig({
  entry: ["src/locales.ts", "src/user.schemas.ts", "src/user.errors.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
