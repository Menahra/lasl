import type { FastifyReply, FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { forgotPasswordHandler } from "@/src/controller/forgot.password.controller.ts";
import { findUserByEmail } from "@/src/service/user.service.ts";

vi.mock("@/src/service/user.service", () => ({
  findUserByEmail: vi.fn(),
}));
const mockedFindUserByEmail = findUserByEmail as unknown as ReturnType<
  typeof vi.fn
>;

const mockReply = (): FastifyReply => {
  const reply = {
    status: vi.fn(),
    send: vi.fn(),
  };
  reply.status = vi.fn().mockReturnValue(reply);
  reply.send = vi.fn().mockReturnValue(reply);
  return reply as unknown as FastifyReply;
};

const mockReq = (
  overrides: Partial<FastifyRequest> = {},
): Parameters<typeof forgotPasswordHandler>[0] => {
  return {
    body: { email: "user@example.com" },
    headers: { host: "localhost:3000" },
    protocol: "http",
    log: {
      info: vi.fn(),
      debug: vi.fn(),
      error: vi.fn(),
    },
    server: {
      sendMail: vi.fn(),
    },
    ...overrides,
  } as unknown as Parameters<typeof forgotPasswordHandler>[0];
};

describe("forgotPasswordHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should log if user by email cannot be found", async () => {
    mockedFindUserByEmail.mockResolvedValue(null);

    const req = mockReq();
    const reply = mockReply();

    await forgotPasswordHandler(req, reply);

    expect(req.log.info).toHaveBeenCalledWith(
      { email: "user@example.com" },
      "Password reset requested for unknown email",
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message:
        "If a user with that email is registered, you will receive a password reset email",
    });
  });

  it("should send verification email if user is not verified", async () => {
    mockedFindUserByEmail.mockResolvedValue({
      email: "user@example.com",
      firstName: "Test",
      verified: false,
      _id: "user-id",
      verificationCode: "verif-code",
      save: vi.fn(),
    });

    const req = mockReq();
    const reply = mockReply();

    await forgotPasswordHandler(req, reply);

    expect(req.server.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Verify your account",
      }),
    );

    expect(req.log.debug).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("should send reset email if user is verified", async () => {
    const saveFn = vi.fn();
    mockedFindUserByEmail.mockResolvedValue({
      email: "user@example.com",
      firstName: "Test",
      verified: true,
      _id: "user-id",
      verificationCode: "verif-code",
      save: saveFn,
    });

    const req = mockReq();
    const reply = mockReply();

    await forgotPasswordHandler(req, reply);

    expect(saveFn).toHaveBeenCalled();
    expect(req.server.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Forgot your password? We’ve got you covered",
      }),
    );

    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("should handle and log unexpected errors", async () => {
    mockedFindUserByEmail.mockRejectedValue(new Error("DB error"));

    const req = mockReq();
    const reply = mockReply();

    await forgotPasswordHandler(req, reply);

    expect(req.log.error).toHaveBeenCalledWith(
      expect.any(Error),
      "An error occured during password reset",
    );

    expect(reply.status).toHaveBeenCalledWith(200);
  });
});
