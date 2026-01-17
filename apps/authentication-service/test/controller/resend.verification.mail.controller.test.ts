import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import type { FastifyReply } from "fastify";
import mongoose from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { buildApp } from "@/src/app.ts";
import { resendVerificationMailHandler } from "@/src/controller/resend.verification.mail.controller.ts";
import { findUserByEmail } from "@/src/service/user.service.ts";
import { loadHtmlTemplate } from "@/src/util/html.template.loader.util.ts";
import { mockUserData } from "@/test/__mocks__/user.mock.ts";

vi.mock("@/src/service/user.service.ts", () => ({
  findUserByEmail: vi.fn(),
}));

vi.mock("@/src/util/html.template.loader.util.ts", () => ({
  loadHtmlTemplate: vi.fn(),
}));

describe("ResendVerificationMailController", () => {
  const mockReply = (): FastifyReply => {
    const reply = {
      status: vi.fn(),
      send: vi.fn(),
    };
    reply.status = vi.fn().mockReturnValue(reply);
    reply.send = vi.fn().mockReturnValue(reply);
    return reply as unknown as FastifyReply;
  };

  const req = {
    body: { email: mockUserData.email },
    server: {
      sendMail: vi.fn(),
      config: {
        // biome-ignore lint/style/useNamingConvention: coming from env
        FRONTEND_BASE_URL: "someUrl",
      },
    },
    headers: {},
    log: { error: vi.fn() },
  };

  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
    vi.clearAllMocks();
  });

  it("sends verification mail for unverified user", async () => {
    const user = {
      _id: { toString: () => "123" },
      email: "test@example.com",
      firstName: "John",
      verified: false,
      verificationCode: "code123",
    };

    // @ts-expect-error ok in test
    vi.mocked(findUserByEmail).mockResolvedValue(user);
    vi.mocked(loadHtmlTemplate).mockResolvedValue("<html />");

    const reply = mockReply();

    // @ts-expect-error ok in test
    await resendVerificationMailHandler(req, reply);

    expect(findUserByEmail).toHaveBeenCalledWith("test@example.com");
    expect(loadHtmlTemplate).toHaveBeenCalledOnce();
    expect(req.server.sendMail).toHaveBeenCalledOnce();
    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("does not send mail if user does not exist", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(null);

    const reply = mockReply();

    // @ts-expect-error ok in test
    await resendVerificationMailHandler(req, reply);

    expect(findUserByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(loadHtmlTemplate).not.toHaveBeenCalled();
    expect(req.server.sendMail).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("does not send mail if user is already verified", async () => {
    const verifiedUser = {
      ...mockUserData,
      verified: true,
    };

    // @ts-expect-error ok in test
    vi.mocked(findUserByEmail).mockResolvedValue(verifiedUser);

    const reply = mockReply();

    // @ts-expect-error ok in test
    await resendVerificationMailHandler(req, reply);

    expect(loadHtmlTemplate).not.toHaveBeenCalled();
    expect(req.server.sendMail).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("logs error and still returns 200 if findUserByEmail throws", async () => {
    vi.mocked(findUserByEmail).mockRejectedValue(
      new Error("DB connection failed"),
    );

    const reply = mockReply();

    // @ts-expect-error ok in test
    await resendVerificationMailHandler(req, reply);

    expect(req.log.error).toHaveBeenCalledOnce();
    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("does not send mail if template loading fails", async () => {
    const user = {
      ...mockUserData,
      verified: false,
    };

    // @ts-expect-error ok in test
    vi.mocked(findUserByEmail).mockResolvedValue(user);
    vi.mocked(loadHtmlTemplate).mockRejectedValue(
      new Error("Template missing"),
    );

    const reply = mockReply();

    // @ts-expect-error ok in test
    await resendVerificationMailHandler(req, reply);

    expect(req.log.error).toHaveBeenCalledOnce();
    expect(req.server.sendMail).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
  });
});
