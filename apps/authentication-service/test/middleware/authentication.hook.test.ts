import { StatusCodes } from "http-status-codes";
import { describe, expect, it, type Mock, vi } from "vitest";
import {
  deserializeSession,
  deserializeUser,
} from "@/src/middleware/authentication.hook.ts";
/* biome-ignore-start lint/performance/noNamespaceImport: okay in test */
import * as authService from "@/src/service/auth.service.ts";
import * as jwtUtil from "@/src/util/jwt.util.ts";
/* biome-ignore-end lint/performance/noNamespaceImport: okay in test */
import { verifyJsonWebToken } from "@/src/util/jwt.util.ts";

vi.mock("@/src/util/jwt.util");

describe("authentication hook middleware", () => {
  describe("deserializeUser", () => {
    it("should return 401 if no authorization header", () => {
      const req = { headers: {} };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      // @ts-expect-error ok in test context
      deserializeUser(req, reply);

      expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({
        message: "Missing or malformed token",
      });
    });

    it("should return 401 if authorization header is malformed", () => {
      const req = { headers: { authorization: "BadToken xyz" } };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      // @ts-expect-error ok in test context
      deserializeUser(req, reply);

      expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({
        message: "Missing or malformed token",
      });
    });

    it("should assign req.user when token is valid", () => {
      const fakePayload = { id: "user1", email: "test@example.com" };
      (verifyJsonWebToken as Mock).mockReturnValue(fakePayload);

      const req = {
        headers: { authorization: "Bearer validtoken" },
        log: { warn: vi.fn() },
      };
      const reply = { status: vi.fn() };

      // @ts-expect-error ok in test context
      deserializeUser(req, reply);

      // @ts-expect-error ok in test context
      expect(req.user).toEqual(fakePayload);
      expect(reply.status).not.toHaveBeenCalled(); // No error
    });

    it("should return 401 if token is invalid", () => {
      (verifyJsonWebToken as Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const req = {
        headers: { authorization: "Bearer invalidtoken" },
        log: { warn: vi.fn() },
      };

      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      // @ts-expect-error ok in test context
      deserializeUser(req, reply);

      expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({ message: "Invalid access token" });
      expect(req.log.warn).toHaveBeenCalled();
    });
  });

  describe("deserializeSession", () => {
    const mockLogger = {
      warn: vi.fn(),
    };

    const mockRequest = {
      cookies: {},
      log: mockLogger,
    };

    it("should return 401 if refreshToken is missing", async () => {
      const req = { ...mockRequest, cookies: {} };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      // @ts-expect-error ok in test
      await deserializeSession(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({
        message: "Missing refresh token",
      });
    });

    it("should return 401 if JWT is invalid", async () => {
      const req = {
        ...mockRequest,
        cookies: { refreshToken: "invalid.token" },
      };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockImplementation(() => {
        throw new Error("Invalid JWT");
      });

      // @ts-expect-error ok in test
      await deserializeSession(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({
        message: "Invalid access token",
      });

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it("should return 401 if session not found", async () => {
      const req = {
        ...mockRequest,
        cookies: { refreshToken: "valid.token" },
      };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValue({
        session: "123",
      });
      vi.spyOn(authService, "findSessionById").mockResolvedValue(null);

      // @ts-expect-error ok in test
      await deserializeSession(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({
        message: "Invalid session",
      });
    });

    it("should return 401 if session is invalid", async () => {
      const req = {
        ...mockRequest,
        cookies: { refreshToken: "valid.token" },
      };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValue({
        session: "123",
      });
      // @ts-expect-error ok in test
      vi.spyOn(authService, "findSessionById").mockResolvedValue({
        valid: false,
      });

      // @ts-expect-error ok in test
      await deserializeSession(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({
        message: "Invalid session",
      });
    });

    it("should attach session to req if everything is valid", async () => {
      const req = {
        ...mockRequest,
        cookies: { refreshToken: "valid.token" },
      };
      const send = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status };

      const mockSession = { _id: "123", valid: true };
      vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValue({
        session: "123",
      });
      // @ts-expect-error ok in test
      vi.spyOn(authService, "findSessionById").mockResolvedValue(mockSession);

      // @ts-expect-error ok in test
      await deserializeSession(req, reply);

      // @ts-expect-error ok in test
      expect(req.session).toEqual(mockSession);
      expect(reply.status).not.toHaveBeenCalled();
    });
  });
});
