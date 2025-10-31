import process from "node:process";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";

export const healthRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.get(
    "/healthcheck",
    {
      schema: {
        summary: "Healthcheck Endpoint",
        description:
          "Checks if the authentication service is running and healthy.",
        tags: ["Health"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              status: { type: "string" },
              message: { type: "string" },
              uptime: { type: "number" },
            },
          },
        },
      },
    },
    (_request, reply) => {
      reply.code(StatusCodes.OK).send({
        status: "ok",
        // biome-ignore lint/security/noSecrets: just a message
        message: "Authentication service is running and healthy!",
        uptime: process.uptime(),
      });
    },
  );
};
