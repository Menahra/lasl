import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResendProvider } from "@/src/util/mailer/providers/resend.provider.ts";
import type { EmailOptions } from "@/src/util/mailer/types.ts";

vi.mock("resend", () => {
  class ResendMock {
    emails = {
      send: vi.fn(),
    };
  }
  return {
    __esModule: true,
    default: ResendMock,
    // biome-ignore lint/style/useNamingConvention: naming from resend
    Resend: ResendMock,
  };
});

describe("ResendProvider", () => {
  let provider: ResendProvider;
  let mockSend: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new ResendProvider("test-api-key");
    // Get reference to the mocked send function
    // @ts-expect-error ok here
    mockSend = provider.resend.emails.send;
  });

  describe("sendEmail", () => {
    it("should send email successfully", async () => {
      const mockResponse = {
        data: {
          id: "email_123",
        },
        error: null,
      };

      mockSend.mockResolvedValueOnce(mockResponse);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "Test content",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({
          id: "email_123",
          from: "sender@example.com",
          to: "recipient@example.com",
        });
        expect(result.data).toEqual({
          id: "email_123",
          from: "sender@example.com",
          to: "recipient@example.com",
        });
        expect(result).not.toContain("error");
        expect(mockSend).toHaveBeenCalledWith({
          from: "sender@example.com",
          to: "recipient@example.com",
          subject: "Test Email",
          html: "<p>Test content</p>",
          text: "Test content",
          replyTo: [],
          cc: [],
          bcc: [],
        });
      } else {
        throw new Error("Expected success response");
      }
    });

    it("should handle multiple recipients", async () => {
      const mockResponse = {
        data: { id: "email_456" },
        error: null,
      };

      mockSend.mockResolvedValueOnce(mockResponse);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: ["recipient1@example.com", "recipient2@example.com"],
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "Some text",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ["recipient1@example.com", "recipient2@example.com"],
        }),
      );
    });

    it("should include optional fields when provided", async () => {
      const mockResponse = {
        data: { id: "email_789" },
        error: null,
      };

      mockSend.mockResolvedValueOnce(mockResponse);

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
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: "reply@example.com",
          cc: "cc@example.com",
          bcc: ["bcc1@example.com", "bcc2@example.com"],
        }),
      );
    });

    it("should handle Resend API errors", async () => {
      const mockResponse = {
        data: null,
        error: {
          message: "Invalid API key",
          name: "AuthenticationError",
        },
      };

      mockSend.mockResolvedValueOnce(mockResponse);

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
        throw new Error("expected a failure in result here");
      }
      expect(result).not.toContain("data");
      expect(result.error).toEqual({
        message: "Invalid API key",
        name: "AuthenticationError",
      });
    });

    it("should handle missing email ID in response", async () => {
      const mockResponse = {
        data: {},
        error: null,
      };

      mockSend.mockResolvedValueOnce(mockResponse);

      const emailOptions: EmailOptions = {
        from: "sender@example.com",
        to: "recipient@example.com",
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "some text",
      };

      const result = await provider.sendEmail(emailOptions);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.id).toBe("");
      } else {
        throw new Error("Expected success response");
      }
    });
  });
});
