import { expect, Locator, Page } from "@playwright/test";
import { test } from "./handle-pages";

export class HomePage {
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
  async navigateToHomePage() {
    await this.page.goto("/");
  }

  async clickNavigationMenuItem(itemName: string) {
    await this.page.waitForLoadState('networkidle'); // Mobile menu might not be clickable immediately

    // Check if the page opened in mobile view
    if (await this.mobileMenuHamburger.isVisible()) {
      await this.mobileMenuHamburger.click({ delay: 1000 }); // Delay added to avoid flaky tests
      await expect(this.mobileMenu).toBeVisible();
    }
    await this.navigationMenuItem
      .getByText(itemName, { exact: true })
      .describe(`Navigate menu item ${itemName}`)
      .click();
  }
}
