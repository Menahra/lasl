import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { fastifyMailerPlugin } from "@/src/util/mailer/mailer.util.ts";
import { createEmailProvider as mockedFactory } from "@/src/util/mailer/providers/provider.factory.ts";
import type { EmailOptions } from "@/src/util/mailer/types.ts";

vi.mock("@/src/util/mailer/providers/provider.factory.ts", () => ({
  createEmailProvider: vi.fn(),
}));

const mockProvider = {
  type: "smtp",
  verifyConnection: vi.fn().mockResolvedValue(true),
  sendEmail: vi.fn(),
};

describe("fastifyMailerPlugin", () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    (mockedFactory as Mock).mockReturnValue(mockProvider);

    fastify = Fastify();
    // @ts-expect-error simple conf suffice here
    fastify.decorate("config", {
      // biome-ignore lint/style/useNamingConvention: ok here
      NODE_ENV: "test",
    });
  });

  afterEach(async () => {
    await fastify.close();
  });

  it("should register plugin and decorate fastify instance", async () => {
    await fastify.register(fastifyMailerPlugin);

    expect(fastify.sendMail).toBeDefined();
    expect(typeof fastify.sendMail).toBe("function");
  });

  it("should verify SMTP connection in test environment", async () => {
    await fastify.register(fastifyMailerPlugin);

    expect(mockProvider.verifyConnection).toHaveBeenCalled();
  });

  it("should log warning when SMTP connection fails", async () => {
    mockProvider.verifyConnection.mockResolvedValueOnce(false);
    const warnSpy = vi.spyOn(fastify.log, "warn");

    await fastify.register(fastifyMailerPlugin);

    expect(warnSpy).toHaveBeenCalledWith(
      "SMTP connection verification failed - emails may not be sent",
    );
  });

  it("should log success when SMTP connection succeeds", async () => {
    const infoSpy = vi.spyOn(fastify.log, "info");

    await fastify.register(fastifyMailerPlugin);

    expect(infoSpy).toHaveBeenCalledWith(
      "SMTP connection verified successfully",
    );
  });

  it("should not verify connection in production", async () => {
    fastify.config.NODE_ENV = "production";
    fastify.config.RESEND_API_KEY = "test_key";

    await fastify.register(fastifyMailerPlugin);

    expect(mockProvider.verifyConnection).not.toHaveBeenCalled();
  });

  describe("sendMail", () => {
    beforeEach(async () => {
      await fastify.register(fastifyMailerPlugin);
    });

    it("should send email successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "email_123",
          from: "sender@example.com",
          to: "recipient@example.com",
        },
      };

      mockProvider.sendEmail.mockResolvedValueOnce(mockResponse);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test</p>",
        text: "this is a test",
      };

      const result = await fastify.sendMail(emailOptions);

      expect(result).toEqual(mockResponse);
      expect(mockProvider.sendEmail).toHaveBeenCalledWith(emailOptions);
    });

    it("should log success message", async () => {
      const infoSpy = vi.spyOn(fastify.log, "info");

      mockProvider.sendEmail.mockResolvedValueOnce({
        success: true,
        data: { id: "email_123" },
      });

      await fastify.sendMail({
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Test</p>",
        text: "this is a test",
      });

      expect(infoSpy).toHaveBeenCalledWith(
        { data: { id: "email_123" } },
        "Email sent successfully",
      );
    });

    it("should log error when email fails", async () => {
      const errorSpy = vi.spyOn(fastify.log, "error");

      const mockResponse = {
        success: false,
        error: {
          message: "Failed to send",
          name: "SendError",
        },
      };

      mockProvider.sendEmail.mockResolvedValueOnce(mockResponse);

      await fastify.sendMail({
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Test</p>",
        text: "this is a test",
      });

      expect(errorSpy).toHaveBeenCalledWith(
        { error: mockResponse.error },
        "Failed to send email with subject: Test",
      );
    });

    it("should handle unexpected errors", async () => {
      const errorSpy = vi.spyOn(fastify.log, "error");

      const error = new Error("Unexpected error");
      mockProvider.sendEmail.mockRejectedValueOnce(error);

      const result = await fastify.sendMail({
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Test</p>",
        text: "this is a test",
      });

      expect(result.success).toBe(false);
      if (result.success) {
        throw new Error("Expected a failure here");
      }

      expect(result.error).toEqual({
        message: "Unexpected error",
        name: "Error",
      });
      expect(errorSpy).toHaveBeenCalled();
    });

    it("should handle non-Error exceptions", async () => {
      mockProvider.sendEmail.mockRejectedValueOnce("String error");

      const result = await fastify.sendMail({
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Test</p>",
        text: "this is a test",
      });

      expect(result.success).toBe(false);
      if (result.success) {
        throw new Error("Expected a failure here");
      }

      expect(result.error).toEqual({
        message: "Unknown error",
        name: "Error",
      });
    });
  });
});
