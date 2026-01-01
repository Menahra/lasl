import { BaseHeader } from "@/utils/components/headers/base.header.component.ts";

export class AppHeader extends BaseHeader {
  private readonly headerRoot = this.page.locator("header");
  private readonly drawer = this.page.getByRole("dialog");

  private async openDrawerIfNeeded() {
    const isDrawerVisible = await this.drawer.isVisible().catch(() => false);

    if (!isDrawerVisible) {
      const menuButton = this.headerRoot.getByRole("button", { name: /menu/i });
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await this.drawer.waitFor({ state: "visible" });
      }
    }

    return isDrawerVisible;
  }

  private async getRootForLinks() {
    const drawerIsVisible = await this.openDrawerIfNeeded();
    return drawerIsVisible ? this.drawer : this.headerRoot;
  }

  async getDonationLink() {
    const root = await this.getRootForLinks();
    return root.getByRole("link", { name: /ko-fi/i });
  }

  async getOpenSourceCodeLink() {
    const root = await this.getRootForLinks();
    return root.getByRole("link", { name: /github/i });
  }

  async navigateToHome() {
    await this.openDrawerIfNeeded();
    await this.headerRoot.getByRole("link", { name: /homepage/i }).click();
  }

  async navigateToLogin() {
    await this.openDrawerIfNeeded();
    await this.headerRoot.getByRole("button", { name: /login/i }).click();
  }
}
