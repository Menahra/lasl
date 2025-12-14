import type { DocumentType } from "@typegoose/typegoose";
import type { FastifyBaseLogger } from "fastify";
import mongoose from "mongoose";
import { afterEach, describe, expect, it, type Mock, vi } from "vitest";
import { SessionModel } from "@/src/model/session.model.ts";
import type { User } from "@/src/model/user.model.ts";
import {
  createSession,
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "@/src/service/auth.service.ts";
import { JWT_ACCESS_PRIVATE_KEYNAME, signJsonWebToken } from "@/src/util/jwt.util.ts";

vi.mock("@/src/model/session.model.ts", () => ({
  // biome-ignore lint/style/useNamingConvention: ok here
  SessionModel: {
    create: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("@/src/util/jwt.util.ts", () => ({
  signJsonWebToken: vi.fn(),
}));

const mockLogger: FastifyBaseLogger = {
  level: "debug",
  silent: vi.fn(),
  fatal: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  child: vi.fn(() => mockLogger),
};

describe("Auth Service", () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockSession = { _id: "session123" };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createSession", () => {
    it("should create a session successfully", async () => {
      (SessionModel.create as Mock).mockResolvedValue(mockSession);

      const result = await createSession(mockUserId, mockLogger);

      expect(SessionModel.create).toHaveBeenCalledWith({ user: mockUserId });
      expect(result).toBe(mockSession);
    });

    it("should log and throw if session creation fails", async () => {
      const error = new Error("DB failure");
      (SessionModel.create as Mock).mockRejectedValue(error);

      await expect(createSession(mockUserId, mockLogger)).rejects.toThrow(
        "Failed to create session: Error: DB failure",
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        error,
        `Could not create session for user with id: ${mockUserId}`,
      );
    });
  });

  describe("findSessionById", () => {
    it("should return a session when a valid ID is provided", async () => {
      const mockFoundSession = { _id: "session123", user: mockUserId };
      (SessionModel.findById as Mock).mockResolvedValue(mockFoundSession);

      const result = await findSessionById("session123");

      expect(SessionModel.findById).toHaveBeenCalledWith("session123");
      expect(result).toEqual(mockFoundSession);
    });

    it("should return null when no session is found", async () => {
      (SessionModel.findById as Mock).mockResolvedValue(null);

      const result = await findSessionById("nonexistent-session");

      expect(SessionModel.findById).toHaveBeenCalledWith("nonexistent-session");
      expect(result).toBeNull();
    });
  });

  describe("signAccessToken", () => {
    const mockUserObjectId = new mongoose.Types.ObjectId();
    const mockUser = {
      _id: mockUserObjectId,
      getJsonWebTokenPayload: () => ({
        id: mockUserObjectId.toString(),
        email: "test@example.com",
      }),
    } as Partial<DocumentType<User>>;

    it("should sign an access token", () => {
      (signJsonWebToken as Mock).mockReturnValue("access-token");

      const result = signAccessToken(
        mockUser as DocumentType<User>,
        mockLogger,
      );

      expect(signJsonWebToken).toHaveBeenCalledWith(
        // @ts-expect-error expected here
        mockUser.getJsonWebTokenPayload?.(),
        JWT_ACCESS_PRIVATE_KEYNAME,
        {
          expiresIn: "15m",
        },
        mockLogger,
      );

      expect(result).toBe("access-token");
    });

    it("should log and throw if signing fails", () => {
      const error = new Error("JWT error");
      (signJsonWebToken as Mock).mockImplementation(() => {
        throw error;
      });

      expect(() =>
        signAccessToken(mockUser as DocumentType<User>, mockLogger),
      ).toThrow("Failed to sign access token: Error: JWT error");

      expect(mockLogger.error).toHaveBeenCalledWith(
        error,
        `Could not sign access token for user with id: ${mockUser._id}`,
      );
    });
  });

  describe("signRefreshToken", () => {
    it("should create session and sign refresh token", async () => {
      (SessionModel.create as Mock).mockResolvedValue(mockSession);
      (signJsonWebToken as Mock).mockReturnValue("refresh-token");

      const result = await signRefreshToken(mockUserId, mockLogger);

      expect(SessionModel.create).toHaveBeenCalledWith({ user: mockUserId });

      expect(signJsonWebToken).toHaveBeenCalledWith(
        { session: mockSession._id },
        "jwtRefreshPrivateKey",
        {
          expiresIn: "30d",
        },
        mockLogger,
      );

      expect(result).toBe("refresh-token");
    });

    it("should log and throw if session creation fails", async () => {
      const error = new Error("DB error");
      (SessionModel.create as Mock).mockRejectedValue(error);

      await expect(signRefreshToken(mockUserId, mockLogger)).rejects.toThrow(
        "Failed to sign refresh token: Error: Failed to create session: Error: DB error",
      );

      expect(mockLogger.error).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          message: "Failed to create session: Error: DB error",
        }),
        `Could not sign resresh token for user with id: ${mockUserId}`,
      );
    });

    it("should log and throw if JWT signing fails", async () => {
      (SessionModel.create as Mock).mockResolvedValue(mockSession);
      const error = new Error("JWT signing failed");
      (signJsonWebToken as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(signRefreshToken(mockUserId, mockLogger)).rejects.toThrow(
        "Failed to sign refresh token: Error: JWT signing failed",
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        error,
        `Could not sign resresh token for user with id: ${mockUserId}`,
      );
    });
  });
});
