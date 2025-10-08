import fastifyPlugin from "fastify-plugin";
import {
  type EnvironmentSchema,
  getEnvironmentConfig,
} from "@/src/config/environment.ts";

export const fastifyEnvironmentPlugin = fastifyPlugin((fastifyInstance) => {
  fastifyInstance.decorate("config", getEnvironmentConfig());
  fastifyInstance.log.info("Environment config attached to Fastify instance.");
});

declare module "fastify" {
  interface FastifyInstance {
    config: EnvironmentSchema;
  }
}
