import type {
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import { StatusCodes } from "http-status-codes";
import type { UserJsonWebTokenPayload } from "../model/user.model.ts";
import { findSessionById } from "../service/auth.service.ts";
import { JWT_ACCESS_PUBLIC_KEYNAME, JWT_REFRESH_PUBLIC_KEYNAME, verifyJsonWebToken } from "../util/jwt.util.ts";

// biome-ignore lint/security/noSecrets: not a secret
export const REFRESH_COOKIE_NAME = "refreshToken";

// biome-ignore lint/suspicious/useAwait: needed for preHandler functionality in fastify
export const deserializeUser = async <
  R extends RouteGenericInterface = RouteGenericInterface,
>(
  req: FastifyRequest<R>,
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
      JWT_ACCESS_PUBLIC_KEYNAME,
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
      JWT_REFRESH_PUBLIC_KEYNAME,
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
