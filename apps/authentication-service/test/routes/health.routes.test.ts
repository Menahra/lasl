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
  });
});
