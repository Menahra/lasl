import { type Page, expect } from "playwright/test";

/**
 * Navigates to the specified baseUrl and waits for the logo placeholder to appear.
 * In future this might be adjusted to wait for a loading screen to disappear
 */
export const navigateAndWaitForPageLoad = async (page: Page) => {
  await page.goto("/");

  await expect(page.getByText("Logo placeholder")).toBeVisible();
};
