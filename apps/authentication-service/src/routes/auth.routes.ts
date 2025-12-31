import { authApiRoutes } from "@lasl/app-contracts/api/auth";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import {
  createSessionConflictResponseSchema,
  createSessionForbiddenResponseSchema,
  createSessionInternalServerErrorResponseSchema,
  createSessionSuccessResponseSchema,
  logoutSuccessResponseSchema,
  logoutUnauthorizedResponseSchema,
  refreshSessionSuccessResponseSchema,
  refreshSessionUnauthorizedResponseSchema,
} from "@/src/routes/auth.routes.schema.ts";
import {
  createSessionHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from "../controller/auth.controller.ts";
import { deserializeSession } from "../middleware/authentication.hook.ts";
import { createSessionJsonSchema } from "../schema/session.schema.ts";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in controller with schema definition
export const authRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post(
    authApiRoutes.session.create(),
    {
      schema: {
        summary: "Create a new session",
        body: createSessionJsonSchema,
        description:
          "Use this endpoint to create a new session for a user. It will return the accessToken in the body and the refreshToken as cookie",
        tags: ["Session"],
        response: {
          [StatusCodes.OK]: {
            description: "Session was created successfully",
            headers: {
              "Set-Cookie": {
                type: "string",
                description:
                  // biome-ignore lint/security/noSecrets: not a secret
                  "HTTP-only cookie named `refreshToken` used for session renewal.",
                example:
                  // biome-ignore lint/security/noSecrets: not a secret
                  "refreshToken=abc123; HttpOnly; Path=/api/v1/sessions/refresh; Max-Age=604800",
              },
            },
            content: {
              "application/json": {
                schema: z.toJSONSchema(createSessionSuccessResponseSchema),
              },
            },
          },
          [StatusCodes.FORBIDDEN]: z.toJSONSchema(
            createSessionForbiddenResponseSchema,
          ),
          [StatusCodes.CONFLICT]: z.toJSONSchema(
            createSessionConflictResponseSchema,
          ),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.toJSONSchema(
            createSessionInternalServerErrorResponseSchema,
          ),
        },
      },
    },
    createSessionHandler,
  );

  fastifyInstance.post(
    authApiRoutes.session.refresh(),
    {
      preHandler: deserializeSession,
      schema: {
        summary: "Refresh the session",
        description:
          "Use this endpoint to refresh the current active session and get a new access token",
        tags: ["Session"],
        response: {
          [StatusCodes.OK]: z.toJSONSchema(refreshSessionSuccessResponseSchema),
          [StatusCodes.UNAUTHORIZED]: z.toJSONSchema(
            refreshSessionUnauthorizedResponseSchema,
          ),
        },
      },
    },
    refreshAccessTokenHandler,
  );

  fastifyInstance.post(
    authApiRoutes.session.logout(),
    {
      preHandler: deserializeSession,
      schema: {
        summary: "Logout the current session",
        description:
          "Invalidates the session and clears the refresh token cookie",
        tags: ["Session"],
        response: {
          [StatusCodes.OK]: z.toJSONSchema(logoutSuccessResponseSchema),
          [StatusCodes.UNAUTHORIZED]: z.toJSONSchema(
            logoutUnauthorizedResponseSchema,
          ),
        },
      },
    },
    logoutHandler,
  );
};
