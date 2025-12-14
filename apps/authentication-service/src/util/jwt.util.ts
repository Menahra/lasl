import type { FastifyBaseLogger } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { getEnvironmentConfig } from "@/src/config/environment.ts";
import type { JWT_ACCESS_PRIVATE_KEY_NAME, JWT_ACCESS_PUBLIC_KEY_NAME, JWT_REFRESH_PRIVATE_KEY_NAME, JWT_REFRESH_PUBLIC_KEY_NAME } from "@/src/constants/jwt.constants.ts";
import { ENVIRONMENT } from "@/src/constants/environment.constants.ts";

export const signJsonWebToken = (
  object: Record<string, unknown>,
  keyName: keyof Pick<
    typeof ENVIRONMENT,
    typeof JWT_ACCESS_PRIVATE_KEY_NAME | typeof JWT_REFRESH_PRIVATE_KEY_NAME
  >,
  options: jsonwebtoken.SignOptions | undefined,
  logger: FastifyBaseLogger,
) => {
  try {
    console.log(getEnvironmentConfig());
    console.log( keyName, ENVIRONMENT[keyName])
    console.log('final', getEnvironmentConfig()[ENVIRONMENT[keyName]])
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
    console.log(error);
    throw new Error(`JsonWebToken signing failed for ${keyName}`);
  }
};

export const verifyJsonWebToken = <T>(
  token: string,
  keyName: keyof Pick<
    typeof ENVIRONMENT,
    typeof JWT_ACCESS_PUBLIC_KEY_NAME | typeof JWT_REFRESH_PUBLIC_KEY_NAME
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
