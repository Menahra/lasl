import process from "node:process";
import z from "zod";

// biome-ignore lint/style/useExportsLast: needs to be before environtmentSchema
export const ENVIRONMENT = {
  applicationHostPort: "APPLICATION_HOST_PORT",
  jwtAccessPrivateKey: "JWT_ACCESS_PRIVATE_KEY",
  jwtAccessPublicKey: "JWT_ACCESS_PUBLIC_KEY",
  jwtRefreshPrivateKey: "JWT_REFRESH_PRIVATE_KEY",
  jwtRefreshPublicKey: "JWT_REFRESH_PUBLIC_KEY",
  mongoUri: "MONGO_URI",
  port: "PORT",
  resendApiKey: "RESEND_API_KEY",
} as const;

const defaultPort = 3000;
const defaultApplicationHostPort = 8080;

const environmentSchema = z.object({
  [ENVIRONMENT.port]: z.coerce.number().default(defaultPort),
  [ENVIRONMENT.mongoUri]: z.string().min(1),
  [ENVIRONMENT.jwtAccessPrivateKey]: z.string().min(1),
  [ENVIRONMENT.jwtAccessPublicKey]: z.string().min(1),
  [ENVIRONMENT.jwtRefreshPrivateKey]: z.string().min(1),
  [ENVIRONMENT.jwtRefreshPublicKey]: z.string().min(1),
  [ENVIRONMENT.applicationHostPort]: z.coerce
    .number()
    .default(defaultApplicationHostPort),
  [ENVIRONMENT.resendApiKey]: z.string().min(1),
});

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export const getEnvironmentConfig = (): EnvironmentSchema =>
  environmentSchema.parse(process.env);

type EnvironmentKey = keyof typeof ENVIRONMENT;

type EnvironmentVar = (typeof ENVIRONMENT)[EnvironmentKey];

// Optional: reverse mapping (UPPER_SNAKE_CASE -> camelCase)
export const ENVIRONMENT_KEYS = Object.fromEntries(
  Object.entries(ENVIRONMENT).map(([key, value]) => [value, key]),
) as Record<EnvironmentVar, EnvironmentKey>;
