import type { FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetPasswordHandler } from "@/src/controller/reset.password.controller.ts";
import { findUserById } from "@/src/service/user.service.ts";

vi.mock("@/src/service/user.service", () => ({
  findUserById: vi.fn(),
}));

const mockedFindUserById = findUserById as unknown as ReturnType<typeof vi.fn>;

const mockReply = (): FastifyReply => {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as unknown as FastifyReply;
};

// biome-ignore lint/security/noSecrets: mock data
const newPassword = "NewPassword123";
const mockReq = (overrides = {}) =>
  ({
    params: {
      id: "user-id",
      passwordResetCode: "valid-code",
    },
    body: {
      password: newPassword,
      passwordConfirmation: newPassword,
    },
    log: {
      info: vi.fn(),
      error: vi.fn(),
    },
    ...overrides,
  }) as unknown as Parameters<typeof resetPasswordHandler>[0];

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in test
// biome-ignore lint/security/noSecrets: not a secret
describe("resetPasswordHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 404 if user is not found", async () => {
    mockedFindUserById.mockResolvedValue(null);

    const req = mockReq();
    const reply = mockReply();

    await resetPasswordHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Could not reset password for user",
    });
  });

  it("should return 400 if reset code is invalid", async () => {
    mockedFindUserById.mockResolvedValue({
      passwordResetCode: "other-code",
    });

    const req = mockReq();
    const reply = mockReply();

    await resetPasswordHandler(req, reply);

    expect(reply.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid password reset code",
    });
  });

  it("should reset password and clear reset code if valid", async () => {
    const save = vi.fn();
    const user = {
      passwordResetCode: "valid-code",
      password: "",
      save,
    };

    mockedFindUserById.mockResolvedValue(user);

    const req = mockReq();
    const reply = mockReply();

    await resetPasswordHandler(req, reply);

    expect(user.password).toBe(newPassword);
    expect(user.passwordResetCode).toBeNull();
    expect(save).toHaveBeenCalled();
    expect(req.log.info).toHaveBeenCalledWith(
      { userId: "user-id" },
      "User with id: user-id changed password successfully",
    );
    expect(reply.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Password successfully changed",
    });
  });

  it("should log and not crash on internal error", async () => {
    mockedFindUserById.mockRejectedValue(new Error("DB crash"));

    const req = mockReq();
    const reply = mockReply();

    await resetPasswordHandler(req, reply);

    expect(req.log.error).toHaveBeenCalledWith(
      expect.any(Error),
      "An error occured during resetting the password for user with id user-id",
    );
  });
});
