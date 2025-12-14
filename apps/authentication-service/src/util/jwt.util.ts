import type { FastifyBaseLogger } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { ENVIRONMENT, getEnvironmentConfig } from "@/src/config/environment.ts";

export const JWT_ACCESS_PRIVATE_KEYNAME = "jwtAccessPrivateKey";
export const JWT_ACCESS_PUBLIC_KEYNAME = "jwtAccessPublicKey";
export const JWT_REFRESH_PRIVATE_KEYNAME = "jwtRefreshPrivateKey";
export const JWT_REFRESH_PUBLIC_KEYNAME = "jwtRefreshPublicKey";

export const signJsonWebToken = (
  object: Record<string, unknown>,
  keyName: keyof Pick<
    typeof ENVIRONMENT,
    typeof JWT_ACCESS_PRIVATE_KEYNAME | typeof JWT_REFRESH_PRIVATE_KEYNAME
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
    logger.error(error, `An error occured during sign of ${keyName} key`);
    throw new Error(`JsonWebToken signing failed for ${keyName}`);
  }
};

export const verifyJsonWebToken = <T>(
  token: string,
  keyName: keyof Pick<
    typeof ENVIRONMENT,
    typeof JWT_ACCESS_PUBLIC_KEYNAME | typeof JWT_REFRESH_PUBLIC_KEYNAME
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
    throw new Error(
      `JsonWebToken verifying failed for token ${token} and keyName ${keyName}`,
    );
  }
};
