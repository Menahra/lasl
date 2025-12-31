import { BaseHeader } from "@/utils/components/headers/base.header.component.ts";

export class AppHeader extends BaseHeader {
  async openDonationLink() {
    await this.page.getByRole("link", { name: /ko-fi/i }).click();
  }

  async openSourceCodeLink() {
    await this.page.getByRole("link", { name: /github/i }).click();
  }

  async navigateToHome() {
    await this.page
      .locator("header")
      .getByRole("link", { name: /homepage/i })
      .click();
  }
}
