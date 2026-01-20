import process from "node:process";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

export async function setup() {
  // Ensure we only create one instance if setup is called multiple times
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Set the URI on process.env so it's accessible across Vitest worker threads
    // biome-ignore lint/complexity/useLiteralKeys: if used with literal key ts complains
    process.env["GLOBAL_MONGO_URI"] = uri;
  }
}

export async function teardown() {
  if (mongod) {
    await mongod.stop();
  }
}
