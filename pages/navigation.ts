import { expect, Locator, Page } from "@playwright/test";

export class PageNavigation {
  readonly page: Page;
  readonly navigationMenuItem: Locator;
  readonly categoryFilter: Locator;
  readonly filterGroup: Locator;
  readonly mobileMenuHamburger: Locator;
  readonly mobileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationMenuItem = this.page.locator(".level-top.ui-corner-all");
    this.mobileMenuHamburger = this.page.locator('span').filter({ hasText: 'Toggle Nav' }).first();
    this.mobileMenu = this.page.getByRole('tab', { name: 'Menu' });

  }
  s
  async clickMainMenuItem(itemName: string) {
    await this.page.waitForLoadState('networkidle')
    if (await this.mobileMenuHamburger.isVisible()) {
      await this.mobileMenuHamburger.click({ delay: 1000 }); // delay added to avoid flaky tests
      await expect(this.mobileMenu).toBeVisible();
    }
    await this.navigationMenuItem
      .getByText(itemName, { exact: true })
      .describe(`Navigate menu item ${itemName}`)
      .click();
  }
}
