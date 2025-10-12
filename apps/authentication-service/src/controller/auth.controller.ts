import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
  type CreateSessionInput,
  vagueSessionErrorMessage,
} from "../schema/session.schema.ts";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../service/auth.service.ts";
import { findUserByEmail, findUserById } from "../service/user.service.ts";
import { verifyJsonWebToken } from "../util/jwt.util.ts";

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
      .setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        // biome-ignore lint/complexity/useLiteralKeys: otherwise ts complains
        secure: process.env["NODE_ENV"] === "production",
        sameSite: "strict",
        path: "/auth/refresh",
        maxAge: 60 * 60 * 24 * 7,
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
    // biome-ignore lint/complexity/useLiteralKeys: otherwise ts complains
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Missing refresh token" });
    }
    const decoded = verifyJsonWebToken<{ session: string }>(
      refreshToken,
      "jwtRefreshPublicKey",
      req.log,
    );

    const session = await findSessionById(decoded.session);

    if (!session?.valid) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Could not refresh access token" });
    }

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
