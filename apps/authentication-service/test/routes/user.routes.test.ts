import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, inject, it, vi } from "vitest";
// biome-ignore lint/performance/noNamespaceImport: okay in tests
import * as userService from "@/src/service/user.service.ts";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@/test/__utils__/setup.utils.ts";
import { checkSwaggerDoc } from "@/test/__utils__/swaggerDoc.util.ts";
import { mockUserInputData } from "../__mocks__/user.mock.ts";

describe("user routes", () => {
  let app: FastifyInstance;
  const mongoDbUri = inject("MONGO_DB_URI");

  const apiPathPrefix = getApiVersionPathPrefix(1);
  const postUsersEndpointPath = `${apiPathPrefix}/users`;

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment();

    await mongoose.connect(mongoDbUri);
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();

    await mongoose.disconnect();
  });

  it("should create a user and return 200", async () => {
    // @ts-expect-error correct that ts complains here
    vi.spyOn(userService, "createUser").mockResolvedValueOnce(undefined);

    const response = await app.inject({
      method: "POST",
      url: postUsersEndpointPath,
      payload: mockUserInputData,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "User successfully created",
    });
  });

  it.each([
    {
      statusCode: StatusCodes.OK,
      responseType: { message: { type: "string" as const } },
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      responseType: {
        message: { type: "string" as const },
        error: { $ref: "#/components/schemas/def-0" },
      },
    },
    {
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      responseType: {
        message: { type: "string" as const },
        errors: {
          type: "object" as const,
          properties: {
            path: { type: "object" as const },
          },
        },
      },
    },
  ])(
    `there there should be a swagger documentation for post ${postUsersEndpointPath} with $statusCode status code`,
    ({ statusCode, responseType }) => {
      // TODO: find out how to better type responseType
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: postUsersEndpointPath,
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: responseType,
      });
    },
  );
});
