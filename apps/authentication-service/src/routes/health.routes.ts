import process from "node:process";
import { authApiRoutes } from "@lasl/app-contracts/api/auth";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { healthcheckSuccessResponseSchema } from "@/src/routes/health.routes.schema.ts";

export const healthRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.get(
    authApiRoutes.miscellaneous.health(),
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
      config: {
        rateLimit: {
          max: 20,
          timeWindow: "1 minute",
        },
      },
    },
    (_request, reply) => {
      reply.code(StatusCodes.OK).send({
        status: "ok",
        message: "Authentication service is running and healthy!",
        uptime: process.uptime(),
      });
    },
  );
};
