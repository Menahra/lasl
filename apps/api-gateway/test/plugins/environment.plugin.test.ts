import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApiGatewayApp } from "@/src/app.ts";

describe("fastifyEnvironmentPlugin", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp: buildApiGatewayApp });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  it("should attach config to fastify instance", () => {
    expect(app.config).toBeDefined();
    expect(app.config.PORT).toBe(3000);
    expect(app.config.AUTHENTICATION_SERVICE_URL).toBe("http://localhost:3001");
  });
});
