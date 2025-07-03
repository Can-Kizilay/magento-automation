import { expect, Locator, Page } from "@playwright/test";
import { Loader } from "../helpers/loader";

export class ProductListing {
  readonly page: Page;
  readonly productCard: Locator;
  readonly addToCartButton: Locator;
  readonly loader: Loader

  constructor(page: Page) {
    this.page = page;
    this.productCard = this.page.locator(".product-item-info");
    this.loader = new Loader(this.page);
  }
  async selectAProduct(isRandomlySelected: boolean) {
    await this.loader.waitForLoaders()
    let productName = "";
    let product = this.productCard.first(); // Default to the first product if not randomly selected
    if (isRandomlySelected) {
      let productCount = await this.productCard.count() - 1; // Get the count of products, subtracting 1 to avoid index out of bounds
      expect(productCount).toBeGreaterThan(0);
      if (productCount !== 0) {
        const randomIndex = Math.floor(Math.random() * productCount); //
        product = this.productCard.nth(randomIndex);
      }
    }

    await expect(product).toBeVisible();
    const productTitle = product.locator(".product-item-link")
    productName = (await productTitle.textContent()) ?? "";
    await product.locator(".product-image-photo").click({ force: true, delay: 1000 });  // delay added to avoid flaky tests
    return productName.trim();
  }
}
