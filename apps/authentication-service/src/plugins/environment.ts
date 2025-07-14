import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

export interface EnvironmentSchema {
  /* biome-ignore-start lint/style/useNamingConvention: using upper case names for env constants */
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  APPLICATION_HOST_PORT: number;
  /* biome-ignore-end lint/style/useNamingConvention: using upper case names for env constants */
}

export const fastifyEnvironmentPlugin = fastifyPlugin(
  async (fastifyInstance) => {
    const schema = {
      type: "object",
      required: ["PORT", "MONGO_URI", "JWT_SECRET", "APPLICATION_HOST_PORT"],
      properties: {
        /* biome-ignore-start lint/style/useNamingConvention: using upper case names for env constants */
        PORT: { type: "number", default: 3000 },
        MONGO_URI: { type: "string" },
        JWT_SECRET: { type: "string" },
        APPLICATION_HOST_PORT: { type: "number", default: 8080 },
        /* biome-ignore-end lint/style/useNamingConvention: using upper case names for env constants */
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
