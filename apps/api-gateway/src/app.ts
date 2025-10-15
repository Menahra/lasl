import fastifyHttpProxy from "@fastify/http-proxy";
import Fastify from "fastify";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";
import { fastifyEnvironmentPlugin } from "@/src/plugins/environment.plugin.ts";

export const buildApiGatewayApp = async () => {
  const fastify = Fastify({
    logger: true,
    // if we are using nginx or similar proxy in future ensure to uncomment following
    // trustProxy: true,
  });

  await fastify.register(fastifyEnvironmentPlugin);

  const { [ENVIRONMENT.authenticationServiceUrl]: authenticationServiceUrl } =
    fastify.config;

  // Proxy /auth/* requests to authentication service
  fastify.register(fastifyHttpProxy, {
    upstream: authenticationServiceUrl,
    prefix: "/auth",
    rewritePrefix: "/auth", // preserve original path
    http2: false,
    replyOptions: {
      // you could manipulate the response here
    },
  });

  return fastify;
};

/* app.get("/health", async () => {
  return { status: "ok" };
}); */

// health check in route auslagern wie in authentication-service
// swagger von den anderen services irgendwie hier mit reinziehen?
