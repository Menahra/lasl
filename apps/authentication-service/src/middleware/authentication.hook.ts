import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import type { UserJsonWebTokenPayload } from "../model/user.model.ts";
import { verifyJsonWebToken } from "../util/jwt.util.ts";

// @ts-expect-error ok to not return on all paths because then execution goes on in next func
export const deserializeUser = (req: FastifyRequest, reply: FastifyReply) => {
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
      "jwtAccessPublicKey",
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
