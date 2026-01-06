/** biome-ignore-all lint/suspicious/noConsole: ok in this file */
import { execSync } from "node:child_process";
import process from "node:process";
import { StatusCodes } from "http-status-codes";

const globalSetup = async () => {
  const reuseContainers = process.env.REUSE_CONTAINERS === "true";

  if (reuseContainers) {
    console.log("♻️  Reusing existing Docker containers...");
  } else {
    console.log("🐳 Starting Docker containers for e2e tests...");
    try {
      // Use the npm script from root package.json
      execSync("pnpm docker:test", {
        stdio: "inherit",
        cwd: "../../", // Run from monorepo root
      });
    } catch (error) {
      console.error("❌ Failed to start Docker containers:", error);
      throw error;
    }
  }

  // Wait for services to be healthy
  console.log("⏳ Waiting for services to be ready...");

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  await waitForService(baseUrl, "Frontend");
  await waitForService(apiUrl, "API Gateway");

  console.log("✅ All services are ready!");
};

const GLOBAL_TIMEOUT = 120_000; // 2 minutes for docker compose up
const RETRY_INTERVAL = 1000;

async function waitForService(
  url: string,
  serviceName: string,
  timeout = GLOBAL_TIMEOUT,
): Promise<void> {
  const start = Date.now();

  console.log(`   Checking ${serviceName} at ${url}...`);

  while (Date.now() - start < timeout) {
    try {
      // biome-ignore lint/performance/noAwaitInLoops: ok in start up
      const response = await fetch(url);

      // Consider service ready if it responds (even with 404)
      if (response.ok || response.status === StatusCodes.NOT_FOUND) {
        console.log(`   ✓ ${serviceName} is ready`);
        return;
      }
    } catch (_error) {
      // Service not ready yet, continue waiting
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  throw new Error(
    `${serviceName} at ${url} did not become ready within ${timeout / 1000}s`,
  );
}

// biome-ignore lint/style/noDefaultExport: ok here
export default globalSetup;
