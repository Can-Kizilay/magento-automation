import { expect, Locator, Page } from "@playwright/test";

export class ProductListing {
  readonly page: Page;
  readonly productCard: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCard = this.page.locator(".product-item-info");
  }
  async selectAProduct(isRandomlySelected: boolean) {
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
    productName = (await product.locator(".product-item-link").textContent()) ?? "";
    await product.click();
    return productName.trim();
  }
}
