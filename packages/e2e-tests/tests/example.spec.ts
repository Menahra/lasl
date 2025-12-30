import { expect, test } from "@playwright/test";

test("can access the application", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot for verification
  await page.screenshot({ path: "homepage.png" });

  console.log("✅ Successfully loaded the application");
});
