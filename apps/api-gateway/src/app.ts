import fastifyHttpProxy from "@fastify/http-proxy";
import Fastify from "fastify";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";
import { fastifyEnvironmentPlugin } from "@/src/plugins/environment.plugin.ts";
import { healthRoutes } from "@/src/routes/health.routes.ts";

export const buildApiGatewayApp = async () => {
  const fastify = Fastify({
    logger: true,
    // if we are using nginx or similar proxy in future ensure to uncomment following
    // trustProxy: true,
  });

  await fastify.register(fastifyEnvironmentPlugin);

  const { [ENVIRONMENT.authenticationServiceUrl]: authenticationServiceUrl } =
    fastify.config;

  fastify.register(healthRoutes);

  // Proxy /auth/* requests to authentication service
  fastify.register(fastifyHttpProxy, {
    upstream: authenticationServiceUrl,
    prefix: "/auth",
    rewritePrefix: "",
    http2: false,
  });

  return fastify;
};
