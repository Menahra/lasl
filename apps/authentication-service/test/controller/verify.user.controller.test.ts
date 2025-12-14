import type { FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyUserHandler } from "@/src/controller/verify.user.controller.ts";
import { findUserById } from "@/src/service/user.service.ts";

vi.mock("@/src/service/user.service", () => ({
  findUserById: vi.fn(),
}));

const mockReply = (): FastifyReply => {
  const reply = {
    status: vi.fn(),
    send: vi.fn(),
  };
  reply.status = vi.fn().mockReturnValue(reply);
  reply.send = vi.fn().mockReturnValue(reply);
  return reply as unknown as FastifyReply;
};

describe("verifyUserHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 for invalid ObjectId", async () => {
    const req = {
      params: {
        id: "invalid-id",
        verificationCode: "123456",
      },
      log: { error: vi.fn(), warn: vi.fn() },
    } as unknown as Parameters<typeof verifyUserHandler>[0];

    const reply = mockReply();

    await verifyUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid user ID format",
    });
  });

  it("should return 404 if user is not found", async () => {
    (findUserById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString(),
        verificationCode: "123456",
      },
      log: { error: vi.fn(), warn: vi.fn() },
    } as unknown as Parameters<typeof verifyUserHandler>[0];

    const reply = mockReply();

    await verifyUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not verify user",
    });
  });

  it("should return 409 if user is already verified", async () => {
    const user = {
      verified: true,
    };

    (findUserById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(user);

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString(),
        verificationCode: "123456",
      },
      log: { error: vi.fn(), warn: vi.fn() },
    } as unknown as Parameters<typeof verifyUserHandler>[0];

    const reply = mockReply();

    await verifyUserHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User is already verified",
    });
  });

  it("should return 400 for incorrect verification code", async () => {
    const user = {
      verified: false,
      verificationCode: "correct-code",
    };

    (findUserById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(user);

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString(),
        verificationCode: "wrong-code",
      },
      log: { error: vi.fn(), warn: vi.fn() },
    } as unknown as Parameters<typeof verifyUserHandler>[0];

    const reply = mockReply();

    await verifyUserHandler(req, reply);

    expect(req.log.warn).toHaveBeenCalledWith(
      {
        userId: req.params.id,
        verificationCode: "wrong-code",
      },
      "Verification failed: incorrect code",
    );

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Incorrect verification code",
    });
  });

  it("should return 200 and verify the user", async () => {
    const save = vi.fn();
    const user = {
      verified: false,
      verificationCode: "123456",
      save,
    };

    (findUserById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(user);

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString(),
        verificationCode: "123456",
      },
      log: { error: vi.fn(), warn: vi.fn() },
    } as unknown as Parameters<typeof verifyUserHandler>[0];

    const reply = mockReply();

    await verifyUserHandler(req, reply);

    expect(user.verified).toBe(true);
    expect(save).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User successfully verified",
    });
  });

  it("should return 500 on unexpected error", async () => {
    (findUserById as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("DB failure"),
    );

    const req = {
      params: {
        id: new mongoose.Types.ObjectId().toString(),
        verificationCode: "123456",
      },
      log: { error: vi.fn(), warn: vi.fn() },
    } as unknown as Parameters<typeof verifyUserHandler>[0];

    const reply = mockReply();

    await verifyUserHandler(req, reply);

    expect(req.log.error).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    expect(reply.send).toHaveBeenCalledWith({
      message: "An unexpected error occurred during verification",
    });
  });
});
