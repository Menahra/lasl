import type { FastifyInstance } from "fastify";
import { describe, expect, it, vi } from "vitest";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@/test/__utils__/setup.utils.ts";

const ResendMock = vi.hoisted(() => vi.fn());
vi.mock("resend", async (importOriginalResendModule) => {
  const orginalResend =
    await importOriginalResendModule<typeof import("resend")>();
  return {
    ...orginalResend,
    // biome-ignore lint/style/useNamingConvention: this is given by resend
    Resend: ResendMock,
  };
});

describe("Resend Mailer util", () => {
  it("should have sendMail decorated", async () => {
    const app = await setupFastifyTestEnvironment();
    expect(typeof app.sendMail).toBe("function");
    await teardownFastifyTestEnvironment();
  });

  it("should send email successfully", async () => {
    const mockSend = vi.fn().mockResolvedValue({
      data: { id: "email-123" },
      error: null,
    });

    ResendMock.mockImplementationOnce(() => ({
      emails: {
        send: mockSend,
      },
    }));

    const app = await setupFastifyTestEnvironment();

    const result = await app.sendMail({
      to: "user@example.com",
      from: "no-reply@example.com",
      subject: "Hello",
      html: "<p>Hello World</p>",
    });

    expect(mockSend).toHaveBeenCalledWith({
      to: "user@example.com",
      from: "no-reply@example.com",
      subject: "Hello",
      html: "<p>Hello World</p>",
    });

    expect(result).toEqual({
      success: true,
      data: { id: "email-123" },
    });

    await teardownFastifyTestEnvironment();
  });

  it("should handle email send error", async () => {
    const fakeError = new Error("Sending failed");
    const mockSend = vi.fn().mockResolvedValue({
      data: null,
      error: fakeError,
    });

    ResendMock.mockImplementationOnce(() => ({
      emails: {
        send: mockSend,
      },
    }));

    const app: FastifyInstance = await setupFastifyTestEnvironment();

    const result = await app.sendMail({
      to: "fail@example.com",
      from: "no-reply@example.com",
      subject: "Failure",
      html: "<p>Failure</p>",
    });

    expect(mockSend).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: fakeError,
    });

    await teardownFastifyTestEnvironment();
  });
});
