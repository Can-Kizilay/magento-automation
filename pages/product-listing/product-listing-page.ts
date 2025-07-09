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
      let productCount = await this.productCard.count()
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
