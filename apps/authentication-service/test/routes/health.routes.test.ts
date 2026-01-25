import { authApiRoutes } from "@lasl/app-contracts/api/auth";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import { checkSwaggerDoc } from "@lasl/test-utils-fastify/swagger-doc-utils";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "@/src/app.ts";
import { BYPASS_RATE_LIMIT_HEADER } from "@/test/__utils__/bypass.rate.limit.header.ts";

describe("health routes", () => {
  let app: FastifyInstance;

  const healthEndpointPath = authApiRoutes.miscellaneous.health();

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  it('GET /healthcheck should return status "ok"', async () => {
    const response = await app.inject({
      method: "GET",
      url: healthEndpointPath,
    });

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.json()).toEqual(
      expect.objectContaining({
        status: "ok",
      }),
    );
  });

  it("should limit requests when the bypass header is missing", async () => {
    for (let i = 0; i < 19; i++) {
      // biome-ignore lint/performance/noAwaitInLoops: ok in this test
      const res = await app.inject({ method: "GET", url: healthEndpointPath });
      expect(res.statusCode).toBe(200);
    }

    const blocked = await app.inject({
      method: "GET",
      url: healthEndpointPath,
    });
    expect(blocked.statusCode).toBe(429);
  });

  it("should NOT limit when the header IS present", async () => {
    for (let i = 0; i < 10; i++) {
      // biome-ignore lint/performance/noAwaitInLoops: ok in this test
      const res = await app.inject({
        method: "GET",
        url: healthEndpointPath,
        headers: BYPASS_RATE_LIMIT_HEADER,
      });
      expect(res.statusCode).toBe(200);
    }
  });

  it("there should be a swagger documentation for /healthcheck", () => {
    checkSwaggerDoc({
      fastifyInstance: app,
      endpointMethod: "get",
      endpointPath: healthEndpointPath,
      endpointStatusCode: StatusCodes.OK,
      endpointContentType: "application/json",
      endpointResponseType: {
        message: { type: "string" },
        status: { type: "string" },
        uptime: { type: "number" },
      },
    });

    checkSwaggerDoc({
      fastifyInstance: app,
      endpointMethod: "get",
      endpointPath: healthEndpointPath,
      endpointStatusCode: StatusCodes.TOO_MANY_REQUESTS,
      endpointContentType: "application/json",
      endpointResponseType: {
        message: { type: "string" },
        error: {
          enum: ["Too Many Requests"],
          type: "string",
        },
        statusCode: {
          enum: [StatusCodes.TOO_MANY_REQUESTS],
          type: "number",
        },
      },
    });
  });
});
