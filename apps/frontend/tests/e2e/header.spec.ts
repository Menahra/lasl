import { expect, test } from "@playwright/test";
import { navigateAndWaitForPageLoad } from "./utils/pageLoad.ts";

test("has title", async ({ page }) => {
  await navigateAndWaitForPageLoad(page);

  // biome-ignore lint/performance/useTopLevelRegex: ok in a test
  await expect(page).toHaveTitle(/Lasl/);
});

test("github link", async ({ context, page }) => {
  await navigateAndWaitForPageLoad(page);

  const pagePromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "GitHub" }).click();

  const gitHubPage = await pagePromise;
  await gitHubPage.waitForLoadState();
  // biome-ignore lint/performance/useTopLevelRegex: ok in a test
  await expect(gitHubPage).toHaveTitle(/GitHub/);
});

test("ko-fi link", async ({ context, page }) => {
  await navigateAndWaitForPageLoad(page);

  const pagePromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "Ko-Fi" }).click();

  const koFiPage = await pagePromise;
  await koFiPage.waitForLoadState();
  // biome-ignore lint/performance/useTopLevelRegex: ok in a test
  await expect(koFiPage).toHaveTitle(/Zioui/);
});

test.describe("light/ dark mode", () => {
  const lightBackgroundColor = "rgb(240, 240, 240)";
  const darkBackgroundColor = "rgb(15, 15, 15)";
  test("without os setting it should be light per default", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "no-preference" });
    await navigateAndWaitForPageLoad(page);

    const body = await page.$("body");
    const backgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe(lightBackgroundColor);
  });

  test("with light setting the app should be in light mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await navigateAndWaitForPageLoad(page);

    const body = await page.$("body");
    const backgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe(lightBackgroundColor);
  });

  test("with dark setting the app should be in light mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await navigateAndWaitForPageLoad(page);

    const body = await page.$("body");
    const backgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe(darkBackgroundColor);
  });

  test("Can change the setting via button", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await navigateAndWaitForPageLoad(page);

    const body = await page.$("body");
    const backgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    expect(backgroundColor).toBe(lightBackgroundColor);

    await page.getByRole("button", { name: "to dark mode" }).click();

    const updatedBackgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(updatedBackgroundColor).toBe(darkBackgroundColor);
  });

  test("remembers theme setting if manually changed", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await navigateAndWaitForPageLoad(page);

    const body = await page.$("body");
    const backgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    expect(backgroundColor).toBe(darkBackgroundColor);

    await page.getByRole("button", { name: "to light mode" }).click();

    const updatedBackgroundColor = await body?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(updatedBackgroundColor).toBe(lightBackgroundColor);

    await page.reload();
    const bodyAfterReload = await page.$("body");

    const backgroundColorAfterPageReload = await bodyAfterReload?.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColorAfterPageReload).toBe(lightBackgroundColor);
  });
});
