import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
  type CreateSessionInput,
  vagueSessionErrorMessage,
} from "../schema/session.schema.ts";
import { findUserByEmail } from "../service/user.service.ts";

export const createSessionHandler = async (
  // biome-ignore lint/style/useNamingConvention: naming from fastify
  req: FastifyRequest<{ Body: CreateSessionInput["body"] }>,
  reply: FastifyReply,
) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return reply
        .status(StatusCodes.FORBIDDEN)
        .send({ message: vagueSessionErrorMessage });
    }

    if (!user.verified) {
      return reply
        .status(StatusCodes.CONFLICT)
        .send({ message: "Please verify your email" });
    }

    const passwordIsValid = user.validatePassword(password);
    if (!passwordIsValid) {
      return reply
        .status(StatusCodes.FORBIDDEN)
        .send({ message: vagueSessionErrorMessage });
    }
  } catch (error) {
    req.log.error(
      error,
      `An error occured during session creation for mail ${email}`,
    );
    return reply
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("An error occured, please try again later");
  }
};
