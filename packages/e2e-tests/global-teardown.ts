/** biome-ignore-all lint/suspicious/noConsole: ok in global file for debug info */
import { execSync } from "node:child_process";
import process from "node:process";

const globalTeardown = () => {
  const reuseContainers = process.env.REUSE_CONTAINERS === "true";

  if (reuseContainers) {
    console.log("♻️  Keeping containers running (REUSE_CONTAINERS=true)");
    return;
  }

  console.log("🧹 Cleaning up Docker containers...");

  try {
    // Use the npm script from root package.json
    execSync("pnpm docker:test:down", {
      stdio: "inherit",
      cwd: "../../",
    });
    console.log("✅ Cleanup complete!");
  } catch (error) {
    console.error("⚠️  Failed to clean up Docker containers:", error);
    // Don't throw - cleanup failures shouldn't fail the test run
  }
};

// biome-ignore lint/style/noDefaultExport: needed for playwright
export default globalTeardown;
