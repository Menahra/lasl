import fastifyCookie from "@fastify/cookie";
import fastifyPlugin from "fastify-plugin";

export const fastifyCookiePlugin = fastifyPlugin((fastifyInstance) => {
  fastifyInstance.register(fastifyCookie, {});
});
