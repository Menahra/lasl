import process from "node:process";
import Fastify from "fastify";
import { connectToMongoDb } from "./database/index.js";
import { fastifyEnvironmentPlugin } from "./plugins/environment.js";
import { healthRoutes } from "./routes/health.routes.js";

export const buildApp = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(fastifyEnvironmentPlugin);

  fastify.log.info(
    // biome-ignore lint/complexity/useLiteralKeys: needed for process env
    `Starting Authentication Service in ${process.env["NODE_ENV"]} mode`,
  );

  try {
    await connectToMongoDb(fastify);
  } catch (error) {
    fastify.log.error("Failed to connect to database. Shutting down.", error);
    process.exit(1);
  }

  // fastify.register(authRoutes, { prefix: '/api/v1/auth' });

  fastify.register(healthRoutes);

  return fastify;
};
