/** biome-ignore-all lint/security/noSecrets: there are no secrets here in test */
/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: ok in test */
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import { checkSwaggerDoc } from "@lasl/test-utils-fastify/swagger-doc-utils";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/src/app.ts";
// biome-ignore lint/performance/noNamespaceImport: ok in test
import * as sessionService from "@/src/service/auth.service.ts";
// biome-ignore lint/performance/noNamespaceImport: ok in test
import * as userService from "@/src/service/user.service.ts";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
// biome-ignore lint/performance/noNamespaceImport: ok in test
import * as jwtUtil from "@/src/util/jwt.util.ts";

describe("auth routes", () => {
  let app: FastifyInstance;
  const apiPathPrefix = getApiVersionPathPrefix(1);
  const sessionsEndpoint = `${apiPathPrefix}/sessions`;

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp, useMongo: true });
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
      getJsonWebTokenPayload: () => ({ id: "something" }),
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
        .mockReturnValueOnce("access.token.here")
        .mockReturnValueOnce("refresh.token.here");

      const response = await app.inject({
        method: "POST",
        url: sessionsEndpoint,
        payload: validSessionPayload,
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        accessToken: "access.token.here",
      });

      const setCookieHeader = response.headers["set-cookie"];
      expect(setCookieHeader).toBeDefined();

      // If Fastify is setting multiple cookies, this could be an array
      const cookie = Array.isArray(setCookieHeader)
        ? setCookieHeader.find((c) => c.startsWith("refreshToken="))
        : setCookieHeader;

      // biome-ignore lint/performance/useTopLevelRegex: okay in test
      expect(cookie).toMatch(/^refreshToken=refresh\.token\.here/);
      expect(cookie).toContain("HttpOnly");
      expect(cookie).toContain("Path=/api/v1/sessions/refresh");
      expect(cookie).toContain("SameSite=Strict");
      // biome-ignore lint/performance/useTopLevelRegex: okay in test
      expect(cookie).toMatch(/Max-Age=\d+/);
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

  describe("POST /sessions/refresh", () => {
    const refreshEndpoint = `${apiPathPrefix}/sessions/refresh`;

    const mockSession = {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      valid: true,
    };

    const mockUser = {
      _id: mockSession.user,
      getJsonWebTokenPayload: () => ({
        id: mockSession.user.toString(),
        email: "test@example.com",
      }),
    };

    it("should return a new access token if refresh token is valid", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValueOnce({
        session: mockSession._id.toString(),
      });

      vi.spyOn(sessionService, "findSessionById").mockResolvedValueOnce(
        // @ts-expect-error ok in test
        mockSession,
      );
      // @ts-expect-error ok in test
      vi.spyOn(userService, "findUserById").mockResolvedValueOnce(mockUser);
      vi.spyOn(jwtUtil, "signJsonWebToken").mockReturnValueOnce(
        "new.access.token",
      );

      const response = await app.inject({
        method: "POST",
        url: refreshEndpoint,
        cookies: {
          refreshToken: "valid.refresh.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({ accessToken: "new.access.token" });
    });

    it("should return 401 if no refresh token is provided", async () => {
      const response = await app.inject({
        method: "POST",
        url: refreshEndpoint,
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({ message: "Missing refresh token" });
    });

    it("should return 401 if session is invalid", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValueOnce({
        session: mockSession._id.toString(),
      });

      // @ts-expect-error ok in test
      vi.spyOn(sessionService, "findSessionById").mockResolvedValueOnce({
        ...mockSession,
        valid: false,
      });

      const response = await app.inject({
        method: "POST",
        url: refreshEndpoint,
        cookies: {
          refreshToken: "valid.refresh.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({
        message: "Invalid session",
      });
    });

    it("should return 401 if user is not found", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValueOnce({
        session: mockSession._id.toString(),
      });

      vi.spyOn(sessionService, "findSessionById").mockResolvedValueOnce(
        // @ts-expect-error ok in test
        mockSession,
      );
      vi.spyOn(userService, "findUserById").mockResolvedValueOnce(null);

      const response = await app.inject({
        method: "POST",
        url: refreshEndpoint,
        cookies: {
          refreshToken: "valid.refresh.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({
        message: "Could not refresh access token",
      });
    });

    it("should return 401 if JWT is invalid", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });

      const response = await app.inject({
        method: "POST",
        url: refreshEndpoint,
        cookies: {
          refreshToken: "invalid.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({
        message: "Invalid access token",
      });
    });
    it("should include Swagger docs for 200 and 401", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: refreshEndpoint,
        endpointStatusCode: StatusCodes.OK,
        endpointContentType: "application/json",
        endpointResponseType: {
          accessToken: { type: "string" },
        },
      });

      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: refreshEndpoint,
        endpointStatusCode: StatusCodes.UNAUTHORIZED,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
        },
      });
    });
  });

  describe("POST /sessions/logout", () => {
    const logoutEndpoint = `${apiPathPrefix}/sessions/logout`;

    const mockSession = {
      valid: true,
      save: vi.fn().mockResolvedValue(undefined),
    };

    it("should invalidate the session, clear the cookie, and return 200", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValueOnce({
        session: "mockSessionId",
      });

      vi.spyOn(sessionService, "findSessionById").mockResolvedValueOnce(
        // @ts-expect-error ok for test
        mockSession,
      );

      const response = await app.inject({
        method: "POST",
        url: logoutEndpoint,
        cookies: {
          refreshToken: "valid.refresh.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({ message: "Logged out successfully" });
      expect(mockSession.valid).toBe(false);
      expect(mockSession.save).toHaveBeenCalled();

      const setCookieHeader = response.headers["set-cookie"];
      expect(setCookieHeader).toBeDefined();

      const cookie = Array.isArray(setCookieHeader)
        ? setCookieHeader.find((c) => c.startsWith("refreshToken="))
        : setCookieHeader;

      // biome-ignore lint/performance/useTopLevelRegex: acceptable in test
      expect(cookie).toMatch(/^refreshToken=;/); // cleared cookie
      expect(cookie).toContain("Path=/api/v1/sessions/refresh");
    });

    it("should return 401 if refresh token is missing", async () => {
      const response = await app.inject({
        method: "POST",
        url: logoutEndpoint,
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({ message: "Missing refresh token" });
    });

    it("should return 401 if refresh token is invalid", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockImplementationOnce(() => {
        throw new Error("Invalid JWT");
      });

      const response = await app.inject({
        method: "POST",
        url: logoutEndpoint,
        cookies: {
          refreshToken: "invalid.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({ message: "Invalid access token" });
    });

    it("should return 401 if session is not found", async () => {
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValueOnce({
        session: "mockSessionId",
      });

      vi.spyOn(sessionService, "findSessionById").mockResolvedValueOnce(null);

      const response = await app.inject({
        method: "POST",
        url: logoutEndpoint,
        cookies: {
          refreshToken: "valid.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({ message: "Invalid session" });
    });

    it("should return 401 if session.save throws an error", async () => {
      const failingSession = {
        valid: true,
        save: vi.fn().mockRejectedValue(new Error("DB error")),
      };

      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValueOnce({
        session: "mockSessionId",
      });

      vi.spyOn(sessionService, "findSessionById").mockResolvedValueOnce(
        // @ts-expect-error ok for test
        failingSession,
      );

      const response = await app.inject({
        method: "POST",
        url: logoutEndpoint,
        cookies: {
          refreshToken: "valid.token",
        },
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({ message: "Logout failed" });
    });

    it("should include Swagger docs for 200 and 401", () => {
      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: logoutEndpoint,
        endpointStatusCode: StatusCodes.OK,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
        },
      });

      checkSwaggerDoc({
        fastifyInstance: app,
        endpointMethod: "post",
        endpointPath: logoutEndpoint,
        endpointStatusCode: StatusCodes.UNAUTHORIZED,
        endpointContentType: "application/json",
        endpointResponseType: {
          message: { type: "string" },
        },
      });
    });
  });
});
