import { BrowserContext } from "@playwright/test";

export class Ads {
  readonly context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  async blockAds() {
    await this.context.route("**/*", (route) => {
      route.request().url().startsWith("https://googleads.")
        ? route.abort()
        : route.continue();
    });
  }
}
