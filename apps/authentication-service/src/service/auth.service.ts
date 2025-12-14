import type { DocumentType } from "@typegoose/typegoose";
import type { FastifyBaseLogger } from "fastify";
import type { Types } from "mongoose";
import type { User } from "@/src/model/user.model.ts";
import { signJsonWebToken } from "@/src/util/jwt.util.ts";
import { JWT_ACCESS_PRIVATE_KEY_NAME } from "@/src/constants/jwt.constants.ts";
import { SessionModel } from "../model/session.model.ts";

export const createSession = async (
  userId: Types.ObjectId,
  logger: FastifyBaseLogger,
) => {
  try {
    return await SessionModel.create({ user: userId });
  } catch (error) {
    logger.error(error, `Could not create session for user with id: ${userId}`);
    throw new Error(`Failed to create session: ${error}`);
  }
};

export const findSessionById = (id: string) => SessionModel.findById(id);

export const signAccessToken = (
  user: DocumentType<User>,
  logger: FastifyBaseLogger,
) => {
  try {
    const payload = user.getJsonWebTokenPayload();

    return signJsonWebToken(
      payload,
      JWT_ACCESS_PRIVATE_KEY_NAME,
      { expiresIn: "15m" },
      logger,
    );
  } catch (error) {
    logger.error(
      error,
      `Could not sign access token for user with id: ${user._id}`,
    );
    throw new Error(`Failed to sign access token: ${error}`);
  }
};

export const signRefreshToken = async (
  userId: Parameters<typeof createSession>[0],
  logger: FastifyBaseLogger,
) => {
  try {
    const session = await createSession(userId, logger);

    return signJsonWebToken(
      { session: session._id },
      // biome-ignore lint/security/noSecrets: key name is no secret
      "jwtRefreshPrivateKey",
      {
        expiresIn: "30d",
      },
      logger,
    );
  } catch (error) {
    logger.error(
      error,
      `Could not sign resresh token for user with id: ${userId}`,
    );
    throw new Error(`Failed to sign refresh token: ${error}`);
  }
};
