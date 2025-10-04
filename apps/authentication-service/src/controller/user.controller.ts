import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Error as MongooseError } from "mongoose";
import type { CreateUserInput } from "../schema/user.schema.ts";
import { createUser } from "../service/user.service.ts";
import { loadHtmlTemplate } from "../util/html.template.loader.util.ts";

export const createUserHandler = async (
  // biome-ignore lint/style/useNamingConvention: property name comes from fastify
  req: FastifyRequest<{ Body: CreateUserInput["body"] }>,
  reply: FastifyReply,
) => {
  const { body } = req;

  try {
    const user = await createUser(body);

    const emailHtml = await loadHtmlTemplate("verification-email", {
      userName: user.firstName,
      verificationCode: user.verificationCode,
      currentYear: new Date().getFullYear().toString(),
    });

    req.server.sendMail({
      to: user.email,
      subject: "Verify your account",
      html: emailHtml,
      text: `Hi ${user.firstName}, your verification code is ${user.verificationCode}`,
      from: "onboarding@resend.dev",
    });

    return reply.status(StatusCodes.OK).send({
      message: "User successfully created",
    });
  } catch (error: unknown) {
    if (error instanceof MongooseError.ValidationError) {
      return reply.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        message: `Could not create user due to validation failure: ${error.message}`,
        errors: error.errors,
      });
    }

    if (error instanceof Error && "code" in error && error.code === 11000) {
      return reply.status(StatusCodes.CONFLICT).send({
        message: "Account already exists",
      });
    }

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: `Unexpected error occurred: ${error}`,
    });
  }
};
