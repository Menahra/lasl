/** biome-ignore-all lint/suspicious/noConsole: ok in global file for debug info */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { config as dotenvConfig } from "dotenv";

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

const globalTeardown = () => {
  console.debug("🧹 Starting global teardown...");

  const reuseContainers = process.env.REUSE_CONTAINERS === "true";
  const composeFile =
    process.env.DOCKER_COMPOSE_FILE || "../../docker-compose.e2e.yml";

  if (reuseContainers) {
    console.debug("♻️  Keeping containers running for reuse...");
  } else {
    console.debug("🐳 Stopping Docker containers...");
    try {
      execSync(`docker compose -f ${composeFile} down -v`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
      console.debug("✅ Docker containers stopped and volumes removed");
    } catch (error) {
      console.error("Failed to stop Docker containers:", error);
    }
  }
};

// biome-ignore lint/style/noDefaultExport: needed for playwright
export default globalTeardown;
