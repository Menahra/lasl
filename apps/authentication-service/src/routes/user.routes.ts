import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { createUserHandler } from "../controller/user.controller.ts";
import { createUserInputSchema } from "../schema/user.schema.ts";
import { ZodFormattedErrorSchemaId } from "../schema/zodFormattedError.schema.ts";

export const userRoutes = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post(
    "/users",
    {
      schema: {
        summary: "Create New Users",
        body: createUserInputSchema.shape.body,
        description:
          "This endpoint is used to create new users via the post method.",
        tags: ["User", "Creation"],
        response: {
          [StatusCodes.OK]: {
            type: "object",
            properties: {
              status: { type: "string" },
              message: { type: "string" },
              uptime: { type: "number" },
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
};
