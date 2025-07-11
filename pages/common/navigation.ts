import { expect, Locator, Page } from "@playwright/test";

export class Navigation {
  readonly page: Page;
  readonly navigationMenuItem: Locator;
  readonly categoryFilter: Locator;
  readonly filterGroup: Locator;
  readonly mobileMenuHamburger: Locator;
  readonly mobileMenu: Locator;
  readonly isMobile: boolean;

  constructor(page: Page, isMobile: boolean = false) {
    this.page = page;
    this.isMobile = isMobile;
    this.navigationMenuItem = this.page.locator(".level-top.ui-corner-all");
    this.mobileMenuHamburger = this.page.locator('span').filter({ hasText: 'Toggle Nav' }).first();
    this.mobileMenu = this.page.getByRole('tab', { name: 'Menu' });

  }

  async clickNavigationMenuItem(itemName: string) {
    await this.page.waitForLoadState('networkidle'); // Mobile menu might not be clickable immediately
    // Check if the page opened in mobile view
    if (this.isMobile) {
      await expect(this.mobileMenuHamburger).toBeVisible();
      await this.mobileMenuHamburger.click({ delay: 1000 }); // Delay added to avoid flaky tests
      await expect(this.mobileMenu).toBeVisible();
    }
    await this.navigationMenuItem
      .getByText(itemName, { exact: true })
      .describe(`Navigate menu item ${itemName}`)
      .click();
  }
}
