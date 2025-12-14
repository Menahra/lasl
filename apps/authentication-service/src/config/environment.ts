import { ENVIRONMENT } from "@/src/constants/environment.constants.ts";
import process from "node:process";
import z from "zod";

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

type EnvironmentKey = keyof typeof ENVIRONMENT;

type EnvironmentVar = (typeof ENVIRONMENT)[EnvironmentKey];

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export const getEnvironmentConfig = (): EnvironmentSchema =>
  environmentSchema.parse(process.env);

// Optional: reverse mapping (UPPER_SNAKE_CASE -> camelCase)
export const ENVIRONMENT_KEYS = Object.fromEntries(
  Object.entries(ENVIRONMENT).map(([key, value]) => [value, key]),
) as Record<EnvironmentVar, EnvironmentKey>;
