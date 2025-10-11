import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { createSessionHandler } from "../controller/auth.controller.ts";
import { createSessionJsonSchema } from "../schema/session.schema.ts";

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
              refreshToken: { type: "string" },
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
};
