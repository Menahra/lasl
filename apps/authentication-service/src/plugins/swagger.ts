import fastifySwagger, {
  type FastifyDynamicSwaggerOptions,
} from "@fastify/swagger";
import fastifySwaggerUi, {
  type FastifySwaggerUiOptions,
} from "@fastify/swagger-ui";
import fastifyPlugin from "fastify-plugin";

export const fastifySwaggerPlugin = fastifyPlugin(async (fastifyInstance) => {
  const swaggerConfig: FastifyDynamicSwaggerOptions = {
    openapi: {
      info: {
        title: "Authentication Service API",
        description: "API documentation for the authentication service.",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
  };
  await fastifyInstance.register(fastifySwagger, swaggerConfig);

  const swaggerUiConfig: FastifySwaggerUiOptions = {
    routePrefix: "/documentation",
  };

  await fastifyInstance.register(fastifySwaggerUi, swaggerUiConfig);
});
