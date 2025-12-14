import { UserModel } from "@/src/model/user.model.ts";
import type { UpdateUserInput } from "@/src/schema/user.schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

export const updateUserHandler = async (
  req: FastifyRequest<{
    // biome-ignore lint/style/useNamingConvention: property name comes from fastify
    Body: UpdateUserInput["body"];
  }>,
  reply: FastifyReply,
) => {
  const { user, body } = req;

  if (!user) {
    return reply.status(StatusCodes.NOT_FOUND).send({
      message: "User not found",
    });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return reply.status(StatusCodes.NOT_FOUND).send({
        message: `Failed to update user with id ${user.id}`,
      });
    }

    const newUser = updatedUser.getJsonWebTokenPayload();

    return reply.status(StatusCodes.OK).send(newUser);
  } catch (error) {
    req.log.error(
      error,
      `An error occurred during update for user: ${user.id}`,
    );
    return reply.status(StatusCodes.BAD_REQUEST).send({
      message: "Failed to update user",
    });
  }
};
