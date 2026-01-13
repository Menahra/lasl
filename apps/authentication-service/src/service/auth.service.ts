import type { DocumentType } from "@typegoose/typegoose";
import type { FastifyBaseLogger } from "fastify";
import type { Types } from "mongoose";
import {
  JWT_ACCESS_PRIVATE_KEY_NAME,
  JWT_REFRESH_PRIVATE_KEY_NAME,
} from "@/src/constants/jwt.constants.ts";
import type { User } from "@/src/model/user.model.ts";
import { signJsonWebToken } from "@/src/util/jwt.util.ts";
import { type Session, SessionModel } from "../model/session.model.ts";

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

export type AccessTokenJsonWebTokenPayload = {
  sub: string;
  session: string;
};

export const signAccessToken = (
  user: DocumentType<User>,
  session: DocumentType<Session>,
  logger: FastifyBaseLogger,
) => {
  try {
    const payload = {
      sub: user._id.toString(),
      session: session._id.toString(),
    };

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

export type RefreshTokenJsonWebTokenPayload = {
  session: string;
};

export const signRefreshToken = (
  session: DocumentType<Session>,
  logger: FastifyBaseLogger,
) => {
  try {
    return signJsonWebToken(
      { session: session._id.toString() },
      JWT_REFRESH_PRIVATE_KEY_NAME,
      {
        expiresIn: "30d",
      },
      logger,
    );
  } catch (error) {
    logger.error(error, "Could not sign resresh token");
    throw new Error(`Failed to sign refresh token: ${error}`);
  }
};
