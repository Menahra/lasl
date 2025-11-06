import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { UserJsonWebTokenPayload } from "../model/user.model.ts";
import { findSessionById } from "../service/auth.service.ts";
import { verifyJsonWebToken } from "../util/jwt.util.ts";

// biome-ignore-start lint/security/noSecrets: these are no secrets
const accessKeyName = "jwtAccessPublicKey";
const refreshKeyName = "jwtRefreshPublicKey";
export const REFRESH_COOKIE_NAME = "refreshToken";
// biome-ignore-end lint/security/noSecrets: these are no secrets

// biome-ignore lint/suspicious/useAwait: needed for preHandler functionality in fastify
export const deserializeUser = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Missing or malformed token" });
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    const decoded = verifyJsonWebToken<UserJsonWebTokenPayload>(
      accessToken,
      accessKeyName,
      req.log,
    );
    req.user = decoded;
  } catch (error) {
    req.log.warn(
      error,
      `Could not deserialize user from access Token: ${accessToken}`,
    );
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Invalid access token" });
  }
};

export const deserializeSession = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Missing refresh token" });
  }
  try {
    const decoded = verifyJsonWebToken<{ session: string }>(
      refreshToken,
      refreshKeyName,
      req.log,
    );

    const session = await findSessionById(decoded.session);

    if (!session?.valid) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Invalid session" });
    }

    req.session = session;
  } catch (error) {
    req.log.warn(
      error,
      `Could not deserialize session from refresh Token: ${refreshToken}`,
    );
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Invalid access token" });
  }
};
