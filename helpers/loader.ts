import { Locator, Page } from "@playwright/test";

export class Loader {
  readonly page: Page;
  readonly loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loader = this.page.locator('loading-mask');

  }

  async waitForLoaders() {
    await this.loader.waitFor({ state: "hidden", timeout: 30000 });
  }
}
