import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@/test/__utils__/setup.utils.ts";
import { checkSwaggerDoc } from "@/test/__utils__/swaggerDoc.util.ts";

describe("health routes", () => {
  let app: FastifyInstance;

  const apiPathPrefix = getApiVersionPathPrefix(1);
  const healthEndpointPath = `${apiPathPrefix}/healthcheck`;

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment();
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  it('GET /healthcheck should return status "ok"', async () => {
    const response = await app.inject({
      method: "GET",
      url: healthEndpointPath,
    });

    expect(response.statusCode).toBe(200);
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
