import z from "zod";

export const ENVIRONMENT = {
  port: "PORT",
  applicationHostPort: "APPLICATION_HOST_PORT",
  authenticationServiceUrl: "AUTHENTICATION_SERVICE_URL",
} as const;

const environmentSchema = z.object({
  [ENVIRONMENT.port]: z.coerce.number().default(3000),
  [ENVIRONMENT.applicationHostPort]: z.coerce.number().default(3000),
  [ENVIRONMENT.authenticationServiceUrl]: z.string().min(1),
});

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export const getEnvironmentConfig = (): EnvironmentSchema =>
  environmentSchema.parse(process.env);
