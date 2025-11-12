import process from "node:process";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { healthcheckSuccessResponseSchema } from "@/src/routes/health.routes.schema.ts";

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
          [StatusCodes.OK]: z.toJSONSchema(healthcheckSuccessResponseSchema),
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
