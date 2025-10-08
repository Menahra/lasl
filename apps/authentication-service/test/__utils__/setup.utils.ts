import type { FastifyInstance } from "fastify";
import { buildApp } from "@/src/app.ts";

let app: FastifyInstance;

export const setupFastifyTestEnvironment =
  async (): Promise<FastifyInstance> => {
    app = await buildApp();
    await app.ready();

    return app;
  };

export const teardownFastifyTestEnvironment = async (): Promise<void> => {
  if (app) {
    await app.close();
  }
};
