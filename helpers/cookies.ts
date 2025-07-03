import { BrowserContext } from "@playwright/test";
import { test as baseTest } from "@playwright/test";
import { TestData } from "../helpers/test-data";

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

const cookieData: Cookie[] = TestData.getJson("cookies");

export class Cookies {
  readonly context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  async handleCookies() {
    await this.context.addCookies(cookieData);
  }
}
