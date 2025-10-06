import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { ResetPasswordInput } from "../schema/user.schema.ts";
import { findUserById } from "../service/user.service.ts";

export const resetPasswordHandler = async (
  req: FastifyRequest<{
    // biome-ignore-start lint/style/useNamingConvention: property name come from fastify
    Body: ResetPasswordInput["body"];
    Params: ResetPasswordInput["params"];
    // biome-ignore-end lint/style/useNamingConvention: property name come from fastify
  }>,
  reply: FastifyReply,
) => {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  try {
    const user = await findUserById(id);

    if (!user) {
      return reply.status(StatusCodes.NOT_FOUND).send({
        message: "Could not reset password for user",
      });
    }

    if (user.passwordResetCode !== passwordResetCode) {
      return reply.status(StatusCodes.BAD_REQUEST).send({
        message: "Invalid password reset code",
      });
    }

    user.passwordResetCode = null;
    user.password = password;
    await user.save();

    req.log.info(
      { userId: id },
      `User with id: ${id} changed password successfully`,
    );

    return reply.status(StatusCodes.OK).send({
      message: "Password successfully changed",
    });
  } catch (error) {
    req.log.error(
      error,
      `An error occured during resetting the password for user with id ${id}`,
    );

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Could not reset the password due to an internal error",
    });
  }
};
