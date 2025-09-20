import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";
import { ENVIRONMENT } from "@/src/config/constants.ts";

export interface EnvironmentSchema {
  [ENVIRONMENT.port]: number;
  [ENVIRONMENT.mongoUri]: string;
  [ENVIRONMENT.jwtSecret]: string;
  [ENVIRONMENT.applicationHostPort]: number;
  [ENVIRONMENT.resendApiKey]: string;
}

export const fastifyEnvironmentPlugin = fastifyPlugin(
  async (fastifyInstance) => {
    const schema = {
      type: "object",
      required: Object.values(ENVIRONMENT),
      properties: {
        [ENVIRONMENT.port]: { type: "number", default: 3000 },
        [ENVIRONMENT.mongoUri]: { type: "string" },
        [ENVIRONMENT.jwtSecret]: { type: "string" },
        [ENVIRONMENT.applicationHostPort]: { type: "number", default: 8080 },
        [ENVIRONMENT.resendApiKey]: { type: "string" },
      },
    };

    await fastifyInstance.register(fastifyEnv, {
      confKey: "config",
      schema,
      dotenv: false,
      data: process.env,
    });

    fastifyInstance.log.info("Environment variables loaded and validated.");
  },
);

declare module "fastify" {
  interface FastifyInstance {
    config: EnvironmentSchema;
  }
}
