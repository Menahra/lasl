import type { FastifyInstance } from "fastify";
import { inject, vi } from "vitest";
import { buildApp } from "@/src/app.ts";
import { ENVIRONMENT } from "@/src/config/constants.ts";

let app: FastifyInstance;

export const setupFastifyTestEnvironment =
  async (): Promise<FastifyInstance> => {
    vi.stubEnv(ENVIRONMENT.jwtSecret, "123test");
    vi.stubEnv(ENVIRONMENT.port, "3000");
    vi.stubEnv(ENVIRONMENT.applicationHostPort, "8080");
    vi.stubEnv(ENVIRONMENT.mongoUri, inject("MONGO_DB_URI"));

    app = await buildApp();
    await app.ready();

    return app;
  };

export const teardownFastifyTestEnvironment = async (): Promise<void> => {
  if (app) {
    await app.close();
  }
};
