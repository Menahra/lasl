import process from "node:process";
import type { FastifyInstance } from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeEach } from "vitest";

let app: FastifyInstance;
let mongoServer: MongoMemoryServer | undefined;

export type TestEnvironmentOptions = {
  buildApp: () => Promise<FastifyInstance>;
  useMongo?: boolean;
  clearDb?: boolean;
};

export const setupFastifyTestEnvironment = async (
  options: TestEnvironmentOptions,
): Promise<FastifyInstance> => {
  const { buildApp, useMongo = false, clearDb = true } = options;

  if (useMongo) {
    // biome-ignore-start lint/complexity/useLiteralKeys: ok here
    const baseMongoUri = process.env["GLOBAL_MONGO_URI"];

    if (baseMongoUri) {
      // Create a unique DB name using random string + timestamp
      // biome-ignore lint/style/noMagicNumbers: ok here
      const uniqueId = Math.random().toString(36).substring(2, 7);
      const timestamp = Date.now();
      const dbName = `test-${timestamp}-${uniqueId}`;

      // Ensure the URI is constructed correctly
      const uriWithDb = baseMongoUri.endsWith("/")
        ? `${baseMongoUri}${dbName}`
        : `${baseMongoUri}/${dbName}`;

      process.env["MONGO_URI"] = uriWithDb;
    } else {
      // Fallback logic if globalSetup isn't used
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      process.env["MONGO_URI"] = mongoServer.getUri();
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env["MONGO_URI"]);
    }
    // biome-ignore-end lint/complexity/useLiteralKeys: ok here

    if (clearDb) {
      beforeEach(async () => {
        if (mongoose.connection.db) {
          await mongoose.connection.db.dropDatabase();
        }
      });
    }
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
