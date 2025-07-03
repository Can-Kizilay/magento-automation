import { Locator, Page } from "@playwright/test";

export class PageNavigation {
  readonly page: Page;
  readonly navigationMenuItem: Locator;
  readonly categoryFilter: Locator;
  readonly filterGroup: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationMenuItem = this.page.locator(".level-top.ui-corner-all");
  }

  async clickMainMenuItem(itemName: string) {
    await this.navigationMenuItem
      .getByText(itemName, { exact: true })
      .describe(`Navigate menu item ${itemName}`)
      .click();
  }
}
