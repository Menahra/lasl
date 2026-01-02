import { expect } from "@playwright/test";
import { BaseHeader } from "@/utils/components/headers/base.header.component.ts";

export class AppHeader extends BaseHeader {
  async expectDonationLink() {
    await this.withHeaderRoot(async (root) => {
      const link = root.getByRole("link", { name: /ko-fi/i });

      await expect(link).toHaveAttribute("href", /ko-fi/i);
      await expect(link).toHaveAttribute("target", "_blank");
    });
  }

  async expectOpenSourceLink() {
    await this.withHeaderRoot(async (root) => {
      const link = root.getByRole("link", { name: /github/i });

      await expect(link).toHaveAttribute("href", /lasl/i);
      await expect(link).toHaveAttribute("target", "_blank");
    });
  }

  async navigateToHome() {
    await this.headerRoot.getByRole("link", { name: /homepage/i }).click();
  }

  async navigateToLogin() {
    await this.withHeaderRoot(async (root) => {
      await root.getByRole("button", { name: /login/i }).click();
    });
  }
}
