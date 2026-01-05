import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import type { FastifyInstance } from "fastify";
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
import { createEmailProvider } from "@/src/util/mailer/providers/provider.factory.ts";
import type { EmailProvider } from "@/src/util/mailer/types.ts";

type MockEmailProvider = EmailProvider & {
  type: string;
  config?: unknown;
};

vi.mock("@/src/util/mailer/providers/smtp.provider.ts", () => {
  return {
    // biome-ignore lint/style/useNamingConvention: ok here
    SmtpProvider: class {
      type = "smtp";
      config: unknown;
      verifyConnection = vi.fn().mockResolvedValue(true);

      constructor(config: unknown) {
        this.config = config;
      }
    },
  };
});

vi.mock("@/src/util/mailer/providers/resend.provider.ts", () => {
  return {
    // biome-ignore lint/style/useNamingConvention: ok here
    ResendProvider: class {
      type = "resend";
      apiKey: string;

      constructor(apiKey: string) {
        this.apiKey = apiKey;
      }
    },
  };
});

describe("createEmailProvider", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(app.log, "info");
  });

  describe("test environment", () => {
    it("should create SMTP provider with default config", () => {
      const provider = createEmailProvider(app) as MockEmailProvider;

      expect(provider.type).toBe("smtp");
      expect(provider.config).toEqual({
        host: "mailpit",
        port: 1025,
        secure: false,
      });
      expect(app.log.info).toHaveBeenCalledWith(
        {
          provider: "smtp",
          host: "mailpit",
          port: 1025,
        },
        "Initializing SMTP email provider",
      );
    });
  });

  describe("development environment", () => {
    it("should create SMTP provider for development", () => {
      createEmailProvider(app);

      expect(app.log.info).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "smtp" }),
        "Initializing SMTP email provider",
      );
    });
  });

  describe("production environment", () => {
    it("should create Resend provider", () => {
      app.config.NODE_ENV = "production";

      createEmailProvider(app);
      expect(app.log.info).toHaveBeenCalledWith(
        { provider: "resend" },
        "Initializing Resend email provider",
      );
    });
  });
});
