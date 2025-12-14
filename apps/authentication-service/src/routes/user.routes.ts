import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import {
  createUserBadRequestResponseSchema,
  createUserConflictResponseSchema,
  createUserInternalServerErrorResponseSchema,
  createUserSuccessResponseSchema,
  createUserUnprocessableEntityResponseSchema,
  forgotPasswordSuccessResponseSchema,
  getCurrentAuthenticatedUserForbiddenResponseSchema,
  getCurrentAuthenticatedUserSuccessResponseSchema,
  resetPasswordBadRequestResponseSchema,
  resetPasswordInternalServerErrorResponseSchema,
  resetPasswordNotFoundResponseSchema,
  resetPasswordSuccessResponseSchema,
  updateCurrentAuthenticatedUserBadRequestResponseSchema,
  updateCurrentAuthenticatedUserForbiddenResponseSchema,
  updateCurrentAuthenticatedUserSuccessResponseSchema,
  verifyUserBadRequestResponseSchema,
  verifyUserConflictResponseSchema,
  verifyUserInternalServerErrorResponseSchema,
  verifyUserNotFoundResponseSchema,
  verifyUserSuccessResponseSchema,
} from "@/src/routes/user.routes.schema.ts";
import { createUserHandler } from "../controller/create.user.controller.ts";
import { forgotPasswordHandler } from "../controller/forgot.password.controller.ts";
import { getUserHandler } from "../controller/get.user.controller.ts";
import { resetPasswordHandler } from "../controller/reset.password.controller.ts";
import { verifyUserHandler } from "../controller/verify.user.controller.ts";
import { deserializeUser } from "../middleware/authentication.hook.ts";
import {
  createUserInputJsonSchema,
  forgotPasswordInputJsonSchema,
  resetPasswordBodyInputJsonSchema,
  resetPasswordParamsInputJsonSchema,
  updateUserInputJsonSchema,
  verifyUserInputJsonSchema,
  type UpdateUserInput,
} from "../schema/user.schema.ts";
import { updateUserHandler } from "@/src/controller/update.user.controller.ts";

const UserSwaggerTag = "User";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in controller with schema definition
export const userRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post(
    "/users",
    {
      schema: {
        summary: "Create New Users",
        body: createUserInputJsonSchema,
        description:
          "This endpoint is used to create new users via the post method.",
        tags: [UserSwaggerTag],
        response: {
          [StatusCodes.OK]: z.toJSONSchema(createUserSuccessResponseSchema),
          [StatusCodes.BAD_REQUEST]: z.toJSONSchema(
            createUserBadRequestResponseSchema,
          ),
          [StatusCodes.UNPROCESSABLE_ENTITY]: z.toJSONSchema(
            createUserUnprocessableEntityResponseSchema,
          ),
          [StatusCodes.CONFLICT]: z.toJSONSchema(
            createUserConflictResponseSchema,
          ),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.toJSONSchema(
            createUserInternalServerErrorResponseSchema,
          ),
        },
      },
    },
    createUserHandler,
  );

  fastifyInstance.get(
    // biome-ignore lint/security/noSecrets: this is a route, not a secret
    "/users/verify/:id/:verificationCode",
    {
      schema: {
        summary: "Verify a specific user",
        params: verifyUserInputJsonSchema,
        description:
          "After a user was created a verification code is sent to the given mail. This then needs to passed via this endpoint to fully verify the user.",
        tags: [UserSwaggerTag],
        response: {
          [StatusCodes.OK]: z.toJSONSchema(verifyUserSuccessResponseSchema),
          [StatusCodes.BAD_REQUEST]: z.toJSONSchema(
            verifyUserBadRequestResponseSchema,
          ),
          [StatusCodes.NOT_FOUND]: z.toJSONSchema(
            verifyUserNotFoundResponseSchema,
          ),
          [StatusCodes.CONFLICT]: z.toJSONSchema(
            verifyUserConflictResponseSchema,
          ),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.toJSONSchema(
            verifyUserInternalServerErrorResponseSchema,
          ),
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
        tags: [UserSwaggerTag],
        response: {
          [StatusCodes.OK]: z.toJSONSchema(forgotPasswordSuccessResponseSchema),
        },
      },
    },
    forgotPasswordHandler,
  );

  fastifyInstance.post(
    // biome-ignore lint/security/noSecrets: this is a route, not a secret
    "/users/resetpassword/:id/:passwordResetCode",
    {
      schema: {
        summary: "Reset the current password",
        params: resetPasswordParamsInputJsonSchema,
        body: resetPasswordBodyInputJsonSchema,
        description:
          "User resets the password with the reset code he got via mail and a new password",
        tags: [UserSwaggerTag],
        response: {
          [StatusCodes.OK]: z.toJSONSchema(resetPasswordSuccessResponseSchema),
          [StatusCodes.BAD_REQUEST]: z.toJSONSchema(
            resetPasswordBadRequestResponseSchema,
          ),
          [StatusCodes.NOT_FOUND]: z.toJSONSchema(
            resetPasswordNotFoundResponseSchema,
          ),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.toJSONSchema(
            resetPasswordInternalServerErrorResponseSchema,
          ),
        },
      },
    },
    resetPasswordHandler,
  );

  fastifyInstance.get(
    "/users/me",
    {
      preHandler: deserializeUser,
      schema: {
        summary: "Get the current authenticated user",
        tags: [UserSwaggerTag],
        description:
          // biome-ignore lint/security/noSecrets: this is a description, not a secret
          "Send the authorization header in format 'Bearer {accessToken}' and receive the user information",
        headers: {
          type: "object",
          properties: { authorization: { type: "string" } },
          required: ["authorization"],
        },
        response: {
          [StatusCodes.OK]: z.toJSONSchema(
            getCurrentAuthenticatedUserSuccessResponseSchema,
          ),
          [StatusCodes.UNAUTHORIZED]: z.toJSONSchema(
            getCurrentAuthenticatedUserForbiddenResponseSchema,
          ),
        },
      },
    },
    getUserHandler,
  );

  fastifyInstance.patch(
    "/users/me",
    {
      preHandler: deserializeUser<{
        // biome-ignore lint/style/useNamingConvention: property name come from fastify
        Body: UpdateUserInput["body"];
      }>,
      schema: {
        summary: "Update the current authenticated user",
        tags: [UserSwaggerTag],
        description:
          "Send the authorization header in Bearer format and the update options to update the current authenticated user",
        headers: {
          type: "object",
          properties: { authorization: { type: "string" } },
          required: ["authorization"],
        },
        body: updateUserInputJsonSchema,
        response: {
          [StatusCodes.OK]: z.toJSONSchema(
            updateCurrentAuthenticatedUserSuccessResponseSchema,
          ),
          [StatusCodes.BAD_REQUEST]: z.toJSONSchema(
            updateCurrentAuthenticatedUserBadRequestResponseSchema,
          ),
          [StatusCodes.UNAUTHORIZED]: z.toJSONSchema(
            updateCurrentAuthenticatedUserForbiddenResponseSchema,
          ),
        },
      },
    },
    updateUserHandler,
  );
};
