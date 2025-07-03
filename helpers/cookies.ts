import { BrowserContext } from "@playwright/test";
import { cookies } from "../test-data/cookies.json";

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

const cookieData: Cookie[] = cookies

export class Cookies {
  readonly context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  async handleCookies() {
    await this.context.addCookies(cookieData);
  }
}
