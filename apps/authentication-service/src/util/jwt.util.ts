import type { FastifyBaseLogger } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { ENVIRONMENT, getEnvironmentConfig } from "@/src/config/environment.ts";

export const signJsonWebToken = (
  object: Record<string, unknown>,
  keyName: keyof Pick<
    typeof ENVIRONMENT,
    "jwtAccessPrivateKey" | "jwtRefreshPrivateKey"
  >,
  options: jsonwebtoken.SignOptions | undefined,
  logger: FastifyBaseLogger,
) => {
  try {
    const privateSigningKey = Buffer.from(
      getEnvironmentConfig()[ENVIRONMENT[keyName]],
      "base64",
    ).toString("ascii");

    return jsonwebtoken.sign(object, privateSigningKey, {
      ...options,
      algorithm: "RS256",
    });
  } catch (error) {
    console.error(error);
    logger.error(error, `An error occured during sign of ${keyName} key`);
    return null;
  }
};

export const verifyJsonWebToken = <T>(
  token: string,
  keyName: keyof Pick<
    typeof ENVIRONMENT,
    "jwtAccessPublicKey" | "jwtRefreshPublicKey"
  >,
  logger: FastifyBaseLogger,
) => {
  const publicSigningKey = Buffer.from(
    getEnvironmentConfig()[ENVIRONMENT[keyName]],
    "base64",
  ).toString("ascii");

  try {
    return jsonwebtoken.verify(token, publicSigningKey) as T;
  } catch (error) {
    logger.error(
      error,
      `An error occured during verification of ${keyName} key`,
    );
    return null;
  }
};
