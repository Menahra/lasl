import {
  SUPPORTED_LOCALES_LABELS,
  type SupportedLocale,
} from "@lasl/app-contracts/locales";
import { expect, type Locator, type Page } from "@playwright/test";

export class BaseHeader {
  protected page: Page;
  protected headerRoot: Locator;
  protected drawer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerRoot = page.locator("header");
    this.drawer = page.locator("dialog") ?? this.headerRoot;
  }

  protected async waitUntilReady() {
    await this.headerRoot.waitFor({ state: "visible" });
  }

  protected async closeDrawer() {
    const drawer = this.page.getByRole("dialog");

    if (await drawer.isVisible().catch(() => false)) {
      await this.page.keyboard.press("Escape");
      await expect(drawer).not.toBeVisible();
    }

    this.drawer = this.headerRoot;
  }

  protected async ensureDrawerOpen(): Promise<boolean> {
    const menuButton = this.headerRoot.getByRole("button", { name: /menu/i });
    const drawer = this.page.getByRole("dialog");

    // Desktop → no drawer
    if (!(await menuButton.isVisible().catch(() => false))) {
      return false;
    }

    // Mobile, drawer already open
    if (await drawer.isVisible().catch(() => false)) {
      this.drawer = drawer;
      return true;
    }

    // Mobile, drawer closed → open it
    await menuButton.click();
    await drawer.waitFor({ state: "visible" });

    this.drawer = drawer;
    return true;
  }

  /**
   * withHeaderRoot guarantees this lifecycle:
      Open drawer if needed
      Run action
      Close drawer if it was opened
   */
  protected async withHeaderRoot<T>(
    action: (root: Locator) => Promise<T>,
  ): Promise<T> {
    await this.waitUntilReady();

    const drawerOpened = await this.ensureDrawerOpen();
    const root = drawerOpened ? this.drawer : this.headerRoot;

    const result = await action(root);

    if (drawerOpened) {
      await this.closeDrawer();
    }

    return result;
  }

  async toggleTheme() {
    await this.withHeaderRoot(async (root) => {
      await root
        .getByRole("button", { name: /switch to (light|dark) mode/i })
        .click();
    });
  }

  async changeLanguage(newLanguage: SupportedLocale) {
    await this.withHeaderRoot(async (root) => {
      await root.getByTestId("language-selector").click();

      await this.page
        .getByRole("option", {
          name: SUPPORTED_LOCALES_LABELS[newLanguage],
        })
        .click();
    });
  }
}
