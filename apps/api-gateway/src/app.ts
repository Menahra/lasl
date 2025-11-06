import fastifyHttpProxy from "@fastify/http-proxy";
import Fastify from "fastify";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";
import { fastifyEnvironmentPlugin } from "@/src/plugins/environment.plugin.ts";
import { fastifySwaggerPlugin } from "@/src/plugins/swagger.plugin.ts";
import { healthRoutes } from "@/src/routes/health.routes.ts";

export const buildApiGatewayApp = async () => {
  const fastify = Fastify({
    logger: true,
    // if we are using nginx or similar proxy in future ensure to uncomment following
    // trustProxy: true,
  });

  await fastify.register(fastifyEnvironmentPlugin);
  await fastify.register(fastifySwaggerPlugin);

  const { [ENVIRONMENT.authenticationServiceUrl]: authenticationServiceUrl } =
    fastify.config;

  fastify.register(healthRoutes);

  // Proxy /auth/* requests to authentication service
  fastify.register(fastifyHttpProxy, {
    upstream: authenticationServiceUrl,
    prefix: "/auth",
    rewritePrefix: "",
    http2: false,
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        const newHeaders = { ...headers };

        // rewrite cookie for authentication request (especially refresh token)
        if (req?.raw.url?.startsWith("/auth") && newHeaders["set-cookie"]) {
          const cookies = Array.isArray(newHeaders["set-cookie"])
            ? newHeaders["set-cookie"]
            : [newHeaders["set-cookie"]];

          newHeaders["set-cookie"] = cookies.map((cookie) => {
            if (cookie.includes("Path=/api/v1")) {
              return cookie.replace(/Path=\/api\/v1/gi, "Path=/auth/api/v1");
            }
            return cookie;
          });
        }

        return newHeaders;
      },
    },
  });

  return fastify;
};
