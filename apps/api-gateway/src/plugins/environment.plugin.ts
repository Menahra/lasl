import fastifyPlugin from "fastify-plugin";
import {
  type EnvironmentSchema,
  getEnvironmentConfig,
} from "@/src/config/environment.config.ts";

declare module "fastify" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for augmentation
  interface FastifyInstance {
    config: EnvironmentSchema;
  }
}

export const fastifyEnvironmentPlugin = fastifyPlugin((fastifyInstance) => {
  fastifyInstance.decorate("config", getEnvironmentConfig());
  fastifyInstance.log.info("Environment config attached to Fastify instance.");
});
