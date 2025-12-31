import type { SupportedLocale } from "@lasl/app-contracts/locales";
import type { Page } from "@playwright/test";

export class BaseHeader {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async toggleTheme() {
    await this.page.getByRole("button", { name: /theme/i }).click();
  }

  async changeLanguage(newLanguage: SupportedLocale) {
    await this.page
      .getByRole("combobox", { name: /language/i })
      .selectOption(newLanguage);
  }
}
