import fastifyPlugin from "fastify-plugin";
import {
  type EnvironmentSchema,
  getEnvironmentConfig,
} from "@/src/config/environment.ts";

declare module "fastify" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: needed for type augmentation
  interface FastifyInstance {
    config: EnvironmentSchema;
  }
}

export const fastifyEnvironmentPlugin = fastifyPlugin((fastifyInstance) => {
  fastifyInstance.decorate("config", getEnvironmentConfig());
  fastifyInstance.log.info("Environment config attached to Fastify instance.");
});
