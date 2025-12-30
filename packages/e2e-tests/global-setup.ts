/** biome-ignore-all lint/suspicious/noConsole: ok in this file */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { config as dotenvConfig } from "dotenv";
import { StatusCodes } from "http-status-codes";

const possibleEnvFiles = [
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../.env.dev"),
  path.resolve(process.cwd(), "../../.env.local"),
];

for (const envFile of possibleEnvFiles) {
  if (existsSync(envFile)) {
    dotenvConfig({ path: envFile });
    break;
  }
}
dotenvConfig();

const globalSetup = async () => {
  const reuseContainers = process.env.REUSE_CONTAINERS === "true";
  const composeFile =
    process.env.DOCKER_COMPOSE_FILE || "../../docker-compose.e2e.yml";

  if (reuseContainers) {
    console.debug("♻️  Reusing existing Docker containers...");
  } else {
    console.debug("🐳 Starting Docker containers...");
    try {
      execSync(`docker compose -f ${composeFile} up -d --build`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
    } catch (error) {
      console.error("Failed to start Docker containers:", error);
      throw error;
    }
  }

  // Wait for services to be healthy
  console.debug("⏳ Waiting for services to be ready...");
  await waitForService(process.env.BASE_URL || "http://localhost:3000");
  await waitForService(process.env.API_URL || "http://localhost:8080");

  console.debug("✅ All services are ready!");
};

const GLOBAL_TIMEOUT = 12_000;
const RETRY_INTERVAL = 1000;
async function waitForService(url: string, timeout = GLOBAL_TIMEOUT) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      // biome-ignore lint/performance/noAwaitInLoops: ok in start up
      const response = await fetch(url);
      if (response.ok || response.status === StatusCodes.NOT_FOUND) {
        console.debug(`✓ Service at ${url} is ready`);
        return;
      }
    } catch (_error) {
      // Service not ready yet, continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  throw new Error(`Service at ${url} did not become ready within ${timeout}ms`);
}

// biome-ignore lint/style/noDefaultExport: ok here
export default globalSetup;
