import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { REFRESH_SESSION_ROUTE } from "@/src/constants/auth.routes.constants.ts";
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
    "/sessions",
    {
      schema: {
        summary: "Create a new session",
        body: createSessionJsonSchema,
        description:
          "Use this endpoint to create a new session for a user. It will return the accessToken and refreshToken",
        tags: ["Session"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
            headers: {
              "Set-Cookie": {
                description:
                  // biome-ignore lint/security/noSecrets: not a secret
                  "HTTP-only cookie named `refreshToken` used for session renewal.",
                type: "string",
                example:
                  // biome-ignore lint/security/noSecrets: not a secret
                  "refreshToken=abc123; HttpOnly; Path=/api/v1/sessions/refresh; Max-Age=604800",
              },
            },
          },
          [StatusCodes.FORBIDDEN]: {
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
    createSessionHandler,
  );

  fastifyInstance.post(
    REFRESH_SESSION_ROUTE,
    {
      preHandler: deserializeSession,
      schema: {
        summary: "Refresh the session",
        description:
          "Use this endpoint to refresh the current active session and get a new access token",
        tags: ["Session"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
          },
          [StatusCodes.UNAUTHORIZED]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    refreshAccessTokenHandler,
  );

  fastifyInstance.post(
    "/sessions/logout",
    {
      preHandler: deserializeSession,
      schema: {
        summary: "Logout the current session",
        description:
          "Invalidates the session and clears the refresh token cookie",
        tags: ["Session"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          [StatusCodes.UNAUTHORIZED]: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    logoutHandler,
  );
};
