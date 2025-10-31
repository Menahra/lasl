import process from "node:process";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
  type CreateSessionInput,
  vagueSessionErrorMessage,
} from "../schema/session.schema.ts";
import { signAccessToken, signRefreshToken } from "../service/auth.service.ts";
import { findUserByEmail, findUserById } from "../service/user.service.ts";

// biome-ignore lint/security/noSecrets: not a secret
const REFRESH_TOKEN_NAME = "refreshToken";
const REFRESH_TOKEN_PATH = "/auth/refresh";
// biome-ignore lint/style/noMagicNumbers: ok in formula
const REFRESH_TOKEN_VALIDITY = 60 * 60 * 24 * 7;

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

    const accessToken = signAccessToken(user, req.log);
    const refreshToken = await signRefreshToken(user._id, req.log);

    return reply
      .setCookie(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        // biome-ignore lint/complexity/useLiteralKeys: otherwise ts complains
        secure: process.env["NODE_ENV"] === "production",
        sameSite: "strict",
        path: REFRESH_TOKEN_PATH,
        maxAge: REFRESH_TOKEN_VALIDITY,
      })
      .status(StatusCodes.OK)
      .send({ accessToken, refreshToken });
  } catch (error) {
    req.log.error(
      error,
      `An error occured during session creation for mail ${email}`,
    );
    return reply
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "An error occured, please try again later" });
  }
};

export const refreshAccessTokenHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { session } = req;

    const user = await findUserById(session.user.toString());

    if (!user) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Could not refresh access token" });
    }

    const accessToken = signAccessToken(user, req.log);

    return reply.status(StatusCodes.OK).send({ accessToken });
  } catch (error) {
    req.log.error(error, "Could not refresh the token/session");
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Could not refresh access token" });
  }
};

export const logoutHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { session } = req;

    session.valid = false;
    await session.save();

    reply.clearCookie(REFRESH_TOKEN_NAME, {
      path: REFRESH_TOKEN_PATH,
    });

    return reply
      .status(StatusCodes.OK)
      .send({ message: "Logged out successfully" });
  } catch (error) {
    req.log.error(error, "Unable to logout");
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Logout failed" });
  }
};
