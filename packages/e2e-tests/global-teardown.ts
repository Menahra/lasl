/** biome-ignore-all lint/suspicious/noConsole: ok in global file for debug info */
import { execSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: path.resolve(process.cwd(), "../../.env.e2e") });
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
