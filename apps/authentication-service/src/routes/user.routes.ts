import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { createUserHandler } from "../controller/create.user.controller.ts";
import { forgotPasswordHandler } from "../controller/forgot.password.controller.ts";
import { resetPasswordHandler } from "../controller/reset.password.controller.ts";
import { verifyUserHandler } from "../controller/verify.user.controller.ts";
import {
  createUserInputJsonSchema,
  forgotPasswordInputJsonSchema,
  resetPasswordBodyInputJsonSchema,
  resetPasswordParamsInputJsonSchema,
  verifyUserInputJsonSchema,
} from "../schema/user.schema.ts";
import { ZodFormattedErrorSchemaId } from "../schema/zodFormattedError.schema.ts";

export const userRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post(
    "/users",
    {
      schema: {
        summary: "Create New Users",
        body: createUserInputJsonSchema,
        description:
          "This endpoint is used to create new users via the post method.",
        tags: ["User", "Creation"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.BAD_REQUEST]: {
            type: "object",
            properties: {
              message: { type: "string" },
              error: { $ref: `${ZodFormattedErrorSchemaId}#` },
            },
          },
          [StatusCodes.UNPROCESSABLE_ENTITY]: {
            type: "object",
            properties: {
              message: { type: "string" },
              errors: {
                type: "object",
                properties: {
                  path: { type: "object" },
                },
              },
            },
          },
          [StatusCodes.CONFLICT]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    createUserHandler,
  );

  fastifyInstance.get(
    "/users/verify/:id/:verificationCode",
    {
      schema: {
        summary: "Verify a specific user",
        params: verifyUserInputJsonSchema,
        description:
          "After a user was created a verification code is sent to the given mail. This then needs to passed via this endpoint to fully verify the user.",
        tags: ["User", "Verification"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.BAD_REQUEST]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.NOT_FOUND]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.CONFLICT]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    verifyUserHandler,
  );

  fastifyInstance.post(
    "/users/forgotpassword",
    {
      schema: {
        summary: "User forgot the password",
        body: forgotPasswordInputJsonSchema,
        description:
          "Users can request a new password if they forgot the current one",
        tags: ["User", "Password", "Forgot"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    forgotPasswordHandler,
  );

  fastifyInstance.post(
    "/users/resetpassword/:id/:passwordResetCode",
    {
      schema: {
        summary: "Reset the current password",
        params: resetPasswordParamsInputJsonSchema,
        body: resetPasswordBodyInputJsonSchema,
        description:
          "User resets the password with the reset code he got via mail and a new password",
        tags: ["User", "Password", "Reset"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.BAD_REQUEST]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.NOT_FOUND]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    resetPasswordHandler,
  );
};
