import { StatusCodes } from "http-status-codes";
import { describe, expect, it, vi } from "vitest";
import {
  createSessionHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from "@/src/controller/auth.controller.ts";
/* biome-ignore-start lint/performance/noNamespaceImport: okay in test */
import * as authService from "@/src/service/auth.service.ts";
import * as userService from "@/src/service/user.service.ts";
import * as jwtUtil from "@/src/util/jwt.util.ts";

/* biome-ignore-end lint/performance/noNamespaceImport: ok intest */

const mockReply = () => {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    setCookie: vi.fn().mockReturnThis(),
  };
  return reply;
};

describe("createSessionHandler", () => {
  const mockUser = {
    _id: "user123",
    email: "test@example.com",
    verified: true,
    validatePassword: vi.fn().mockReturnValue(true),
    getJsonWebTokenPayload: () => ({
      id: "user123",
      email: "test@example.com",
    }),
  };

  it("should create session and return tokens", async () => {
    vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce(
      // @ts-expect-error - mocking
      mockUser,
    );
    vi.spyOn(authService, "signAccessToken").mockReturnValue(
      "access.token.here",
    );
    vi.spyOn(authService, "signRefreshToken").mockResolvedValue(
      "refresh.token.here",
    );

    const req = {
      body: {
        email: "test@example.com",
        password: "StrongPassword1!",
      },
      log: { error: vi.fn() },
    };

    const reply = mockReply();

    // @ts-expect-error okay in test
    await createSessionHandler(req, reply);

    expect(reply.setCookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh.token.here",
      expect.objectContaining({
        httpOnly: true,
        path: "/auth/refresh",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      }),
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      accessToken: "access.token.here",
      refreshToken: "refresh.token.here",
    });
  });

  it("should return 403 if user not found", async () => {
    vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce(null);

    const req = {
      body: { email: "unknown@example.com", password: "irrelevant" },
      log: { error: vi.fn() },
    };

    const reply = mockReply();

    // @ts-expect-error okay in test
    await createSessionHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("should return 409 if user not verified", async () => {
    // @ts-expect-error okay in test
    vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce({
      ...mockUser,
      verified: false,
    });

    const req = {
      body: { email: "test@example.com", password: "irrelevant" },
      log: { error: vi.fn() },
    };

    const reply = mockReply();

    // @ts-expect-error okay in test
    await createSessionHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(409);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Please verify your email",
    });
  });

  it("should return 403 if password is invalid", async () => {
    const invalidUser = {
      ...mockUser,
      validatePassword: vi.fn().mockReturnValue(false),
    };
    // @ts-expect-error okay in test
    vi.spyOn(userService, "findUserByEmail").mockResolvedValueOnce(invalidUser);

    const req = {
      body: { email: "test@example.com", password: "wrong" },
      log: { error: vi.fn() },
    };

    const reply = mockReply();

    // @ts-expect-error okay in test
    await createSessionHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });
});

describe("refreshAccessTokenHandler", () => {
  const mockReply = () => ({
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  });

  const mockLog = { error: vi.fn() };

  it("should return new access token if session and user are valid", async () => {
    vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValue({
      session: "session123",
    });
    const mockSession = {
      _id: "session123",
      user: "user123",
      valid: true,
    };
    // @ts-expect-error okay in test
    vi.spyOn(authService, "findSessionById").mockResolvedValue(mockSession);
    const mockUser = {
      _id: "user123",
      email: "test@example.com",
      getJsonWebTokenPayload: () => ({
        id: "user123",
        email: "test@example.com",
      }),
    };
    // @ts-expect-error okay in test
    vi.spyOn(userService, "findUserById").mockResolvedValue(mockUser);
    vi.spyOn(authService, "signAccessToken").mockReturnValue(
      "new.access.token",
    );

    const req = {
      session: mockSession,
      log: mockLog,
    };
    const reply = mockReply();

    // @ts-expect-error okay in test
    await refreshAccessTokenHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      accessToken: "new.access.token",
    });
  });

  it("should return 401 if no cookie is present", async () => {
    const req = {
      cookies: {},
      log: mockLog,
    };
    const reply = mockReply();

    // @ts-expect-error okay in test
    await refreshAccessTokenHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not refresh access token",
    });
  });

  it("should return 401 if session is invalid", async () => {
    vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValue({
      session: "session123",
    });
    vi.spyOn(authService, "findSessionById").mockResolvedValue(null);

    const req = {
      cookies: { refreshToken: "some.token" },
      log: mockLog,
    };
    const reply = mockReply();

    // @ts-expect-error okay in test
    await refreshAccessTokenHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not refresh access token",
    });
  });

  it("should return 401 if user is not found", async () => {
    vi.spyOn(jwtUtil, "verifyJsonWebToken").mockReturnValue({
      session: "session123",
    });
    vi.spyOn(authService, "findSessionById").mockResolvedValue({
      // @ts-expect-error okay in test
      user: "user123",
      valid: true,
    });
    vi.spyOn(userService, "findUserById").mockResolvedValue(null);

    const req = {
      cookies: { refreshToken: "some.token" },
      log: mockLog,
    };
    const reply = mockReply();

    // @ts-expect-error okay in test
    await refreshAccessTokenHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not refresh access token",
    });
  });

  it("should catch and log unexpected errors", async () => {
    vi.spyOn(jwtUtil, "verifyJsonWebToken").mockImplementation(() => {
      throw new Error("bad token");
    });

    const req = {
      cookies: { refreshToken: "bad.token" },
      log: mockLog,
    };
    const reply = mockReply();

    // @ts-expect-error okay in test
    await refreshAccessTokenHandler(req, reply);

    expect(mockLog.error).toHaveBeenCalledWith(
      expect.any(Error),
      "Could not refresh the token/session",
    );

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not refresh access token",
    });
  });

  describe("logoutHandler", () => {
    it("should invalidate session, clear cookie, and return success", async () => {
      const mockSave = vi.fn();
      const mockSession = { valid: true, save: mockSave };

      const req = {
        session: mockSession,
        log: { error: vi.fn() },
      };

      const send = vi.fn().mockReturnThis();
      const clearCookie = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status, clearCookie };

      // @ts-expect-error ok in test
      await logoutHandler(req, reply);

      expect(mockSession.valid).toBe(false);
      expect(mockSave).toHaveBeenCalled();

      expect(clearCookie).toHaveBeenCalledWith("refreshToken", {
        path: "/auth/refresh",
      });

      expect(status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(send).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });

    it("should return 401 and log if logout fails", async () => {
      const req = {
        session: {
          valid: true,
          save: vi.fn().mockRejectedValue(new Error("DB error")),
        },
        log: { error: vi.fn() },
      };

      const send = vi.fn().mockReturnThis();
      const clearCookie = vi.fn().mockReturnThis();
      const status = vi.fn(() => ({ send }));
      const reply = { status, clearCookie };

      // @ts-expect-error ok in test
      await logoutHandler(req, reply);

      expect(req.log.error).toHaveBeenCalledWith(
        expect.any(Error),
        "Unable to logout",
      );

      expect(status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(send).toHaveBeenCalledWith({ message: "Logout failed" });
    });
  });
});
