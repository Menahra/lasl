import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

export const getUserHandler = (req: FastifyRequest, reply: FastifyReply) => {
  return reply.status(StatusCodes.OK).send(req.user);
};
