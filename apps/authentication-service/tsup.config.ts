import { defineConfig } from "tsup";

// biome-ignore lint/style/noDefaultExport: needed for tsup
export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    // this is needed since fastify plugin uses dynamic require and we want to compile to esm
    "@fastify/swagger",
    "@fastify/swagger-ui",
    "fastify-plugin",
  ],
  onSuccess: "cpx 'src/templates/**/*' dist/templates",
});
