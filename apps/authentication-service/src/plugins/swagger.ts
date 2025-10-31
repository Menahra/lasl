import fastifySwagger, {
  type FastifyDynamicSwaggerOptions,
} from "@fastify/swagger";
import fastifySwaggerUi, {
  type FastifySwaggerUiOptions,
} from "@fastify/swagger-ui";
import { fastifyPlugin } from "fastify-plugin";
import { ENVIRONMENT } from "../config/environment.ts";

export const fastifySwaggerPlugin = fastifyPlugin(async (fastifyInstance) => {
  const { [ENVIRONMENT.applicationHostPort]: port } = fastifyInstance.config;
  const swaggerConfig: FastifyDynamicSwaggerOptions = {
    openapi: {
      info: {
        // biome-ignore lint/security/noSecrets: doc title, no secret
        title: "Authentication Service API",
        description: "API documentation for the authentication service.",
        version: "1.0.0",
      },
      servers: [{ url: `http://localhost:${port}` }],
    },
  };
  await fastifyInstance.register(fastifySwagger, swaggerConfig);

  const swaggerUiConfig: FastifySwaggerUiOptions = {
    routePrefix: "/documentation",
    indexPrefix: "/auth",
  };

  await fastifyInstance.register(fastifySwaggerUi, swaggerUiConfig);
});
