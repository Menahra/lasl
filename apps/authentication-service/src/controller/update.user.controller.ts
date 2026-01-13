import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "@/src/model/user.model.ts";
import type { UpdateUserInput } from "@/src/schema/user.schema.ts";
import { serializeUser } from "@/src/serializer/user.serializer.ts";
import { removeUndefinedDeep } from "@/src/util/object.util.ts";

export const updateUserHandler = async (
  req: FastifyRequest<{
    // biome-ignore lint/style/useNamingConvention: property name comes from fastify
    Body: UpdateUserInput["body"];
  }>,
  reply: FastifyReply,
) => {
  const { userId, body } = req;

  if (!userId) {
    return reply.status(StatusCodes.NOT_FOUND).send({
      message: "User not found",
    });
  }

  try {
    const userDoc = await UserModel.findById(userId);

    if (!userDoc) {
      return reply.status(StatusCodes.NOT_FOUND).send({
        message: `User with id ${userId} not found`,
      });
    }

    const updateWithoutUndefined = removeUndefinedDeep(body);
    userDoc.set(updateWithoutUndefined);

    const updatedUser = await userDoc.save();

    return reply.status(StatusCodes.OK).send(serializeUser(updatedUser));
  } catch (error) {
    req.log.error(error, `An error occurred during update for user: ${userId}`);
    return reply.status(StatusCodes.BAD_REQUEST).send({
      message: "Failed to update user",
    });
  }
};
