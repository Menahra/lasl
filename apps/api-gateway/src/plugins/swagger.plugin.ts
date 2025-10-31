import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi, {
  type FastifySwaggerUiOptions,
} from "@fastify/swagger-ui";
import { fastifyPlugin } from "fastify-plugin";
import { StatusCodes } from "http-status-codes";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: mostly configuration so ok here
export const fastifySwaggerPlugin = fastifyPlugin(async (fastifyInstance) => {
  const {
    [ENVIRONMENT.applicationHostPort]: port,
    [ENVIRONMENT.authenticationServiceUrl]: authenticationServiceUrl,
  } = fastifyInstance.config;

  const microServiceDocumentationProxyConfig = {
    authenticationService: {
      proxyUrl: "/docs/authentication-service/json",
      realUrl: `${authenticationServiceUrl}/documentation/json`,
    },
  };

  fastifyInstance.get(
    microServiceDocumentationProxyConfig.authenticationService.proxyUrl,
    async (req, reply) => {
      try {
        const res = await fetch(
          microServiceDocumentationProxyConfig.authenticationService.realUrl,
        );
        const json = await res.json();
        return reply.send(json);
      } catch (err) {
        req.log.error(err);
        return reply
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ error: "Unable to load service docs" });
      }
    },
  );

  await fastifyInstance.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "API Gateway",
        version: "1.0.0",
      },
    },
    hideUntagged: true,
  });

  const swaggerUiConfig: FastifySwaggerUiOptions = {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      urls: [
        {
          url: "/documentation/json",
          name: "API Gateway",
        },
        {
          url: microServiceDocumentationProxyConfig.authenticationService
            .proxyUrl,
          // biome-ignore lint/security/noSecrets: no secret
          name: "Authentication Service",
        },
      ],
    },
  };

  await fastifyInstance.register(fastifySwaggerUi, swaggerUiConfig);

  fastifyInstance.log.info(
    `Swagger-Dokumentation verfügbar unter http://localhost:${port}/documentation`,
  );
});
