import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { serializeUser } from "@/src/serializer/user.serializer.ts";
import { findUserById } from "@/src/service/user.service.ts";

export const getUserHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { userId } = req;

  if (!userId) {
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Could not get current user" });
  }

  const user = await findUserById(userId);

  if (!user) {
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Could not get current user" });
  }

  return reply.status(StatusCodes.OK).send(serializeUser(user));
};
