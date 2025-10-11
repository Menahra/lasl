import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
// biome-ignore lint/performance/noNamespaceImport: ok in test
import * as userService from "@/src/service/user.service.ts";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
// biome-ignore lint/performance/noNamespaceImport: ok in test
import * as jwtUtil from "@/src/util/jwt.util.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@/test/__utils__/setup.utils.ts";
import { checkSwaggerDoc } from "@/test/__utils__/swaggerDoc.util.ts";

describe("auth routes", () => {
  let app: FastifyInstance;
  const apiPathPrefix = getApiVersionPathPrefix(1);
  const sessionsEndpoint = `${apiPathPrefix}/sessions`;

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment();
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  describe("POST /sessions", () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: "test@example.com",
      firstName: "Test",
      verified: true,
      validatePassword: () => true,
      // biome-ignore lint/style/useNamingConvention: naming given by mongoose
      toJSON: () => ({ id: "something" }),
    };

    const validSessionPayload = {
      email: "test@example.com",
      password: "StrongPassword1!",
    };

    it("should create session and return tokens", async () => {
      vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce(
        // @ts-expect-error ts correctly warns about mocking
        mockUser,
      );
      vi.spyOn(jwtUtil, "signJsonWebToken")
        .mockReturnValueOnce("access.token.here") // for accessToken
        .mockReturnValueOnce("refresh.token.here"); // for refreshToken

      const response = await app.inject({
        method: "POST",
        url: sessionsEndpoint,
        payload: validSessionPayload,
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        accessToken: "access.token.here",
        refreshToken: "refresh.token.here",
      });
    });

    it("should return 403 if user validation fails", async () => {
      const userWithPasswordValidationFailing = {
        ...mockUser,
        validatePassword: () => false,
      };

      vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce(
        // @ts-expect-error mock fail
        userWithPasswordValidationFailing,
      );

      const response = await app.inject({
        method: "POST",
        url: sessionsEndpoint,
        payload: validSessionPayload,
      });

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(response.json()).toEqual({
        message: "Invalid email or password",
      });
    });

    it("should include Swagger docs for 200", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: sessionsEndpoint,
        endpointStatusCode: StatusCodes.OK,
        endpointContentType: "application/json",
        endpointResponseType: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      });
    });

    it.each([
      StatusCodes.FORBIDDEN,
      StatusCodes.CONFLICT,
      StatusCodes.INTERNAL_SERVER_ERROR,
    ])("should include %s in Swagger documentation", (statusCode) => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: sessionsEndpoint,
        endpointStatusCode: statusCode,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
        },
      });
    });
  });
});
