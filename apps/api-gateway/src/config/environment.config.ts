import process from "node:process";
import { z } from "zod";

// biome-ignore lint/style/useExportsLast: needed before schema
export const ENVIRONMENT = {
  port: "PORT",
  applicationHostPort: "APPLICATION_HOST_PORT",
  authenticationServiceUrl: "AUTHENTICATION_SERVICE_URL",
} as const;

const environmentSchema = z.object({
  // biome-ignore-start lint/style/noMagicNumbers: fallback value
  [ENVIRONMENT.port]: z.coerce.number().default(3000),
  [ENVIRONMENT.applicationHostPort]: z.coerce.number().default(3000),
  // biome-ignore-end lint/style/noMagicNumbers: fallback value
  [ENVIRONMENT.authenticationServiceUrl]: z.string().min(1),
});

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export const getEnvironmentConfig = (): EnvironmentSchema =>
  environmentSchema.parse(process.env);
