import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";

export const healthRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.get("/healthcheck", (_request, reply) => {
    reply
      .code(StatusCodes.OK)
      .send({
        status: "ok",
        message: "Authentication service is running and healthy!",
        uptime: process.uptime(),
      });
  });
};
