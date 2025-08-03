import type { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@/test/utils/setup.utils.ts";

describe("health routes", () => {
  let app: FastifyInstance;
  const mongoDbUri = inject("MONGO_DB_URI");

  beforeAll(async () => {
    app = await setupFastifyTestEnvironment();

    await mongoose.connect(mongoDbUri);
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();

    await mongoose.disconnect();
  });

  it('GET /healthcheck should return status "ok"', async () => {
    const response = await app.inject({
      method: "GET",
      url: "/healthcheck",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        status: "ok",
      }),
    );
  });
});
