import type { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, inject, it, vi } from "vitest";
import * as userService from "@/src/service/user.service.ts";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@/test/__utils__/setup.utils.ts";
import { checkSwaggerDoc } from "@/test/__utils__/swaggerDoc.util.ts";
import { mockUserData } from "../__mocks__/user.mock.ts";

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
    vi.spyOn(userService, "createUser").mockResolvedValueOnce(undefined);

    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: [
        {
          ...mockUserData,
          passwordConfirmation: mockUserData.password,
        },
      ],
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "User successfully created",
    });
  });

  it("there should be a swagger documentation for post /users", () => {
    checkSwaggerDoc({
      fastifyInstance: app,
      endpointMethod: "get",
      endpointPath: postUsersEndpointPath,
      endpointStatusCode: 200,
      endpointContentType: "application/json",
      endpointResponseType: {
        message: { type: "string" },
        status: { type: "string" },
        uptime: { type: "number" },
      },
    });
  });
});
