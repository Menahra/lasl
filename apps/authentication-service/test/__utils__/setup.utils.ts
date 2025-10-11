import type { FastifyInstance } from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { buildApp } from "@/src/app.ts";

let app: FastifyInstance;
let mongoServer: MongoMemoryServer;

export const setupFastifyTestEnvironment =
  async (): Promise<FastifyInstance> => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // biome-ignore lint/complexity/useLiteralKeys: the other way ts would complain
    process.env["MONGO_URI"] = mongoUri;

    // Connect mongoose here to this fresh memory server URI
    await mongoose.connect(mongoUri);

    app = await buildApp();
    await app.ready();

    return app;
  };

export const teardownFastifyTestEnvironment = async (): Promise<void> => {
  if (app) {
    await app.close();
  }

  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
