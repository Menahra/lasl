import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { buildApiGatewayApp } from "@/src/app.ts";

describe("fastifySwaggerPlugin", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // @ts-expect-error okay in test
    global.fetch = vi.fn(async () => ({
      json: async () => ({ openapi: "3.0.0", info: { title: "Mock Service" } }),
    }));

    app = await setupFastifyTestEnvironment({ buildApp: buildApiGatewayApp });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  it("should register /documentation route", async () => {
    const res = await app.inject({ method: "GET", url: "/documentation" });
    expect(res.statusCode).toBe(200);
  });

  it("should proxy docs from authentication service", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/docs/authentication-service/json",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/documentation/json",
    );
    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.openapi).toBe("3.0.0");
  });
});
