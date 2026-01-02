import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { legalRoutes } from "@lasl/app-contracts/routes/legal";
import { expect, type Page, test } from "@playwright/test";
import { AppHeader } from "@/utils/components/headers/app.header.component.ts";

const expectTheme = async (page: Page, theme: "light" | "dark") => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
};

test.describe("Header", () => {
  test("login button navigates to login page", async ({ page }) => {
    await page.goto(authRoutes.home);

    const appHeader = new AppHeader(page);
    await appHeader.navigateToLogin();

    await expect(page).toHaveURL(authRoutes.login);
  });

  test("logo navigates to home", async ({ page }) => {
    await page.goto(legalRoutes.imprint);

    const appHeader = new AppHeader(page);
    await appHeader.navigateToHome();

    await expect(page).toHaveURL(authRoutes.home);
  });

  test.describe("Light / dark mode", () => {
    test("without os setting, app is in light mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "no-preference" });
      await page.goto(authRoutes.home);

      await expectTheme(page, "light");
    });

    test("with light setting the app should be in light mode", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(authRoutes.home);

      await expectTheme(page, "light");
    });

    test("with dark setting the app should be in dark mode", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(authRoutes.home);

      await expectTheme(page, "dark");
    });

    test("can change the setting via button", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(authRoutes.home);

      await expectTheme(page, "light");

      const appHeader = new AppHeader(page);
      await appHeader.toggleTheme();

      await expectTheme(page, "dark");
    });

    test("remembers theme setting if manually changed", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(authRoutes.home);

      await expectTheme(page, "dark");

      const appHeader = new AppHeader(page);
      await appHeader.toggleTheme();

      await expectTheme(page, "light");

      await page.reload();
      await expectTheme(page, "light");
    });
  });

  test("can change language via header language selector", async ({ page }) => {
    await page.goto(authRoutes.home);

    const appHeader = new AppHeader(page);

    await appHeader.changeLanguage("de-DE");
    await expect(
      page.getByRole("heading", { name: /klassisches arabisch/i }),
    ).toBeVisible();

    await appHeader.changeLanguage("fr-FR");
    await expect(
      page.getByRole("heading", { name: /l'arabe classique/i }),
    ).toBeVisible();
  });

  test("GitHub button links to repository", async ({ page }) => {
    await page.goto(authRoutes.home);

    const appHeader = new AppHeader(page);
    await appHeader.expectOpenSourceLink();
  });

  test("donation button links to donation page", async ({ page }) => {
    await page.goto(authRoutes.home);

    const appHeader = new AppHeader(page);
    await appHeader.expectDonationLink();
  });

  test.describe("Header - Mobile", () => {
    const mobileViewport = { width: 375, height: 812 };

    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
    });

    test("login button navigates to login page (mobile drawer)", async ({
      page,
    }) => {
      await page.goto(authRoutes.home);

      const appHeader = new AppHeader(page);
      await appHeader.navigateToLogin();

      await expect(page).toHaveURL(authRoutes.login);
    });

    test("logo navigates to home (mobile drawer)", async ({ page }) => {
      await page.goto(legalRoutes.imprint);

      const appHeader = new AppHeader(page);
      await appHeader.navigateToHome();

      await expect(page).toHaveURL(authRoutes.home);
    });

    test("GitHub button links to repository (mobile drawer)", async ({
      page,
    }) => {
      await page.goto(authRoutes.home);

      const appHeader = new AppHeader(page);
      await appHeader.expectOpenSourceLink();
    });

    test("donation button links to donation page (mobile drawer)", async ({
      page,
    }) => {
      await page.goto(authRoutes.home);

      const appHeader = new AppHeader(page);
      await appHeader.expectDonationLink();
    });

    test("can change language via header language selector (mobile drawer)", async ({
      page,
    }) => {
      await page.goto(authRoutes.home);

      const appHeader = new AppHeader(page);

      await appHeader.changeLanguage("de-DE");
      await expect(
        page.getByRole("heading", { name: /klassisches arabisch/i }),
      ).toBeVisible();
    });

    test("can toggle theme via button (mobile drawer)", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(authRoutes.home);

      const appHeader = new AppHeader(page);

      await appHeader.toggleTheme();
      await expectTheme(page, "dark");
    });
  });
});
