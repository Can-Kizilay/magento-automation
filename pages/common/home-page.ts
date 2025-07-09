import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly homePageTitle: Locator;


  constructor(page: Page) {
    this.page = page;
    this.homePageTitle = this.page.locator('.page-title-wrapper')
  }
  async navigateToHomePage() {
    await this.page.goto("/");
  }

  async verifyHomePage() {
    await expect(this.homePageTitle).toHaveText('Home Page');
  }
}
