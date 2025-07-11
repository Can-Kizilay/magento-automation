import { BrowserContext } from "@playwright/test";
import { cookies } from "../test-data/cookies.json";
import { Cookie } from "../interfaces/cookie";



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
