import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    // biome-ignore lint/style/useNamingConvention: okay for global provided context
    MONGO_DB_URI: string;
  }
}

// biome-ignore lint/style/noDefaultExport: needed for vitest
export default async ({ provide }: TestProject) => {
  const mongoDbMemoryServer = await MongoMemoryServer.create();
  const mongoDbUri = mongoDbMemoryServer.getUri();

  await mongoose.connect(mongoDbUri);
  provide("MONGO_DB_URI", mongoDbUri);

  return async () => {
    await mongoose.disconnect();
    await mongoDbMemoryServer.stop();
  };
};
