import { USER_ERRORS } from "@lasl/app-contracts/errors/user";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "@/src/model/user.model.ts";
import type { UpdatePasswordInputSchemaType } from "@/src/schema/update.password.schema.ts";

export const updatePasswordHandler = async (
  req: FastifyRequest<{
    // biome-ignore lint/style/useNamingConvention: property name comes from fastify
    Body: UpdatePasswordInputSchemaType["body"];
  }>,
  reply: FastifyReply,
) => {
  const { userId } = req;
  const { currentPassword, password } = req.body;

  if (!userId) {
    return reply.status(StatusCodes.UNAUTHORIZED).send({
      message: "User not authenticated",
    });
  }

  try {
    const userDoc = await UserModel.findById(userId);

    if (!userDoc) {
      return reply.status(StatusCodes.NOT_FOUND).send({
        message: "User not found",
      });
    }

    const isCurrentPasswordValid =
      await userDoc.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return reply.status(StatusCodes.FORBIDDEN).send({
        message: USER_ERRORS.passwordIncorrect,
      });
    }

    userDoc.password = password;
    await userDoc.save();

    return reply.status(StatusCodes.OK).send({
      message: "Password changed successfully",
    });
  } catch (error) {
    req.log.error(
      error,
      `An error occurred updating password for user: ${userId}`,
    );
    return reply.status(StatusCodes.BAD_REQUEST).send({
      message: "Failed to update password",
    });
  }
};
