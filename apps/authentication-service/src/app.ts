import process from "node:process";
import Fastify from "fastify";
import { fastifyEnvironmentPlugin } from "./plugins/environment.ts";
import { connectToMongoDb } from "./database/index.ts";

export const buildApp = async () => {
	const fastify = Fastify({
    logger: true,
  });

	await fastify.register(fastifyEnvironmentPlugin);

	fastify.log.info(`Starting Authentication Service in ${process.env['NODE_ENV']} mode`);

	try {
    await connectToMongoDb(fastify);
  } catch (error) {
		console.info(error)
    fastify.log.error('Failed to connect to database. Shutting down.', error);
    process.exit(1);
  }

  // fastify.register(authRoutes, { prefix: '/api/v1/auth' });

  fastify.get('/status', async (_request, reply) => {
    reply.send({ status: 'ok', message: 'Authentication service is running and healthy!' });
  });

  return fastify;
};
