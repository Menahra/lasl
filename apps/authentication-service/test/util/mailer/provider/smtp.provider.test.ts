import nodemailer from "nodemailer";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { SmtpProvider } from "@/src/util/mailer/providers/smtp.provider.ts";
import type { EmailOptions } from "@/src/util/mailer/types.ts";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

describe("SmtpProvider", () => {
  let provider: SmtpProvider;
  let mockSendMail: ReturnType<typeof vi.fn>;
  let mockVerify: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSendMail = vi.fn();
    mockVerify = vi.fn();

    (nodemailer.createTransport as Mock).mockReturnValue({
      sendMail: mockSendMail,
      verify: mockVerify,
    });

    provider = new SmtpProvider({
      host: "localhost",
      port: 1025,
      secure: false,
    });
  });

  describe("constructor", () => {
    it("should create transporter with provided config", () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "localhost",
        port: 1025,
        secure: false,
        auth: undefined,
      });
    });

    it("should create transporter with auth when provided", () => {
      vi.clearAllMocks();

      new SmtpProvider({
        host: "smtp.example.com",
        port: 587,
        secure: true,
        auth: {
          user: "testuser",
          pass: "testpass",
        },
      });

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "smtp.example.com",
        port: 587,
        secure: true,
        auth: {
          user: "testuser",
          pass: "testpass",
        },
      });
    });
  });

  describe("sendEmail", () => {
    it("should send email successfully", async () => {
      const mockInfo = {
        messageId: "<123@localhost>",
        accepted: ["recipient@example.com"],
        rejected: [],
      };

      mockSendMail.mockResolvedValueOnce(mockInfo);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "Test content",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(true);

      if (!result.success) {
        throw new Error("Expected a success here");
      }
      expect(result.data?.id).toBe("<123@localhost>");
      expect(result.data?.from).toBe("sender@example.com");
      expect(result.data?.to).toBe("recipient@example.com");
      expect(result).not.toContain("error");

      expect(mockSendMail).toHaveBeenCalledWith({
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "Test content",
        replyTo: undefined,
        cc: undefined,
        bcc: undefined,
      });
    });

    it("should handle multiple recipients", async () => {
      const mockInfo = {
        messageId: "<456@localhost>",
      };

      mockSendMail.mockResolvedValueOnce(mockInfo);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: ["recipient1@example.com", "recipient2@example.com"],
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "some text",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ["recipient1@example.com", "recipient2@example.com"],
        }),
      );
    });

    it("should include optional fields when provided", async () => {
      const mockInfo = {
        messageId: "<789@localhost>",
      };

      mockSendMail.mockResolvedValueOnce(mockInfo);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "some text",
        replyTo: "reply@example.com",
        cc: "cc@example.com",
        bcc: ["bcc1@example.com", "bcc2@example.com"],
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: "reply@example.com",
          cc: "cc@example.com",
          bcc: ["bcc1@example.com", "bcc2@example.com"],
        }),
      );
    });

    it("should handle SMTP errors", async () => {
      const error = new Error("SMTP connection failed");
      error.name = "SMTPError";

      mockSendMail.mockRejectedValueOnce(error);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "some text",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected a failure here");
      }

      expect(result).not.toContain("data");
      expect(result.error).toEqual({
        message: "SMTP connection failed",
        name: "SMTPError",
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockSendMail.mockRejectedValueOnce("String error");

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "some text",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected a success here");
      }

      expect(result.error).toEqual({
        message: "Unknown error",
        name: "Error",
      });
    });
  });

  describe("verifyConnection", () => {
    it("should return true when connection is successful", async () => {
      mockVerify.mockResolvedValueOnce(true);

      const result = await provider.verifyConnection();

      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalled();
    });

    it("should return false when connection fails", async () => {
      mockVerify.mockRejectedValueOnce(new Error("Connection failed"));

      const result = await provider.verifyConnection();

      expect(result).toBe(false);
      expect(mockVerify).toHaveBeenCalled();
    });
  });
});
