import type { Page } from "@playwright/test";

export class Footer {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async navigateToHome() {
    await this.page
      .locator("footer")
      .getByRole("link", { name: /homepage/i })
      .click();
  }

  async navigateToPrivacyPolicy() {
    await this.page
      .locator("footer")
      .getByRole("link", { name: /privacy/i })
      .click();
  }

  async navigateToTermsOfService() {
    await this.page
      .locator("footer")
      .getByRole("link", { name: /terms/i })
      .click();
  }

  async navigateToImprint() {
    await this.page
      .locator("footer")
      .getByRole("link", { name: /imprint/i })
      .click();
  }
}
