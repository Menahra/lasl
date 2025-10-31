import process from "node:process";
import type { FastifyInstance } from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let app: FastifyInstance;
let mongoServer: MongoMemoryServer | undefined;

export type TestEnvironmentOptions = {
  buildApp: () => Promise<FastifyInstance>;
  useMongo?: boolean;
};

export const setupFastifyTestEnvironment = async (
  options: TestEnvironmentOptions,
): Promise<FastifyInstance> => {
  const { buildApp, useMongo = false } = options;

  if (useMongo) {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // biome-ignore lint/complexity/useLiteralKeys: if used with literal key ts complains
    process.env["MONGO_URI"] = mongoUri;
    await mongoose.connect(mongoUri);
  }

  app = await buildApp();
  await app.ready();
  return app;
};

export const teardownFastifyTestEnvironment = async (): Promise<void> => {
  if (app) {
    await app.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  await mongoose.disconnect();
};
