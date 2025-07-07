import { BrowserContext } from "@playwright/test";

export class Ads {
  readonly context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  async blockAds() {
    await this.context.route("**/*", (route) => {
      const url = route.request().url();

      const adPatterns = [
        "googleads.",
        "googlesyndication.",
      ];

      const block = adPatterns.some(pattern => url.includes(pattern));

      if (block) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }
}

