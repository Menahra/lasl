import z from "zod";

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

const environmentSchema = z.object({
  [ENVIRONMENT.port]: z.coerce.number().default(3000),
  [ENVIRONMENT.mongoUri]: z.string().min(1),
  [ENVIRONMENT.jwtAccessPrivateKey]: z.string().min(1),
  [ENVIRONMENT.jwtAccessPublicKey]: z.string().min(1),
  [ENVIRONMENT.jwtRefreshPrivateKey]: z.string().min(1),
  [ENVIRONMENT.jwtRefreshPublicKey]: z.string().min(1),
  [ENVIRONMENT.applicationHostPort]: z.coerce.number().default(8080),
  [ENVIRONMENT.resendApiKey]: z.string().min(1),
});

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export const getEnvironmentConfig = (): EnvironmentSchema =>
  environmentSchema.parse(process.env);
