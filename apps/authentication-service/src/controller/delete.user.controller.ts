import {
  authApiRoutes,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@lasl/app-contracts/api/auth";
import { USER_ERRORS } from "@lasl/app-contracts/errors/user";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { SessionModel } from "@/src/model/session.model.ts";
import { UserModel } from "@/src/model/user.model.ts";
import type { DeleteUserInputSchemaType } from "@/src/schema/delete.user.schema.ts";

const fullRefreshSessionRoute = authApiRoutes.session.refresh();

export const deleteUserHandler = async (
  req: FastifyRequest<{
    // biome-ignore lint/style/useNamingConvention: property name comes from fastify
    Body: DeleteUserInputSchemaType["body"];
  }>,
  reply: FastifyReply,
) => {
  const { userId, sessionId } = req;
  const { password } = req.body;

  if (!(userId && sessionId)) {
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

    const isPasswordValid = await userDoc.validatePassword(password);
    if (!isPasswordValid) {
      return reply.status(StatusCodes.FORBIDDEN).send({
        message: USER_ERRORS.passwordIncorrect,
      });
    }

    // Invalidate session
    const session = await SessionModel.findById(sessionId);
    if (session) {
      session.valid = false;
      await session.save();
    }

    // Delete user
    await UserModel.deleteOne({ _id: userId });

    // Clear refresh token cookie
    reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      path: fullRefreshSessionRoute,
    });

    return reply.status(StatusCodes.OK).send({
      message: "Account deleted successfully",
    });
  } catch (error) {
    req.log.error(error, `An error occurred deleting user: ${userId}`);
    return reply.status(StatusCodes.BAD_REQUEST).send({
      message: "Failed to delete account",
    });
  }
};
