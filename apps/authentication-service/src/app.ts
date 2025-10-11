import process from "node:process";
import Fastify from "fastify";
import { connectToMongoDb } from "./database/index.ts";
import { fastifyEnvironmentPlugin } from "./plugins/environment.ts";
import { fastifySwaggerPlugin } from "./plugins/swagger.ts";
import { authRoutes } from "./routes/auth.routes.ts";
import { healthRoutes } from "./routes/health.routes.ts";
import { userRoutes } from "./routes/user.routes.ts";
import {
  ZodFormattedErrorSchema,
  ZodFormattedErrorSchemaId,
} from "./schema/zodFormattedError.schema.ts";
import { getApiVersionPathPrefix } from "./util/api.path.util.ts";
import { fastifyMailerPlugin } from "./util/mailer.util.ts";

export const buildApp = async () => {
  const fastify = Fastify({
    logger: true,
    // if we are using nginx or similar proxy in future ensure to uncomment following
    // trustProxy: true,
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

  await fastify.register(fastifyMailerPlugin);
  await fastify.register(fastifySwaggerPlugin);

  fastify.register(healthRoutes, {
    prefix: getApiVersionPathPrefix(1),
  });
  fastify.register(userRoutes, {
    prefix: getApiVersionPathPrefix(1),
  });
  fastify.register(authRoutes, {
    prefix: getApiVersionPathPrefix(1),
  });

  fastify.addSchema({
    $id: ZodFormattedErrorSchemaId,
    ...ZodFormattedErrorSchema,
  });

  return fastify;
};
