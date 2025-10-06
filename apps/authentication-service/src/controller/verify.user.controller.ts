import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import type { VerifyUserInput } from "../schema/user.schema.ts";
import { findUserById } from "../service/user.service.ts";

export const verifyUserHandler = async (
  // biome-ignore lint/style/useNamingConvention: property name comes from fastify
  req: FastifyRequest<{ Params: VerifyUserInput["params"] }>,
  reply: FastifyReply,
) => {
  const { id, verificationCode } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(StatusCodes.BAD_REQUEST).send({
        message: "Invalid user ID format",
      });
    }

    const user = await findUserById(id);

    if (!user) {
      return reply.status(StatusCodes.NOT_FOUND).send({
        message: "Could not verify user",
      });
    }

    if (user.verified) {
      return reply.status(StatusCodes.CONFLICT).send({
        message: "User is already verified",
      });
    }

    if (user.verificationCode !== verificationCode) {
      req.log.warn(
        { userId: id, verificationCode },
        "Verification failed: incorrect code",
      );

      return reply.status(StatusCodes.BAD_REQUEST).send({
        message: "Incorrect verification code",
      });
    }

    user.verified = true;
    await user.save();
    return reply.status(StatusCodes.OK).send({
      message: "User successfully verified",
    });
  } catch (error) {
    req.log.error(
      error,
      `An Error occured during verification of user with id: ${id}`,
    );

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "An unexpected error occurred during verification",
    });
  }
};
