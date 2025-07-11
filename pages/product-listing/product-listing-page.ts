import { Locator, Page } from "@playwright/test";

export class ProductListing {
  readonly page: Page;
  readonly productCard: Locator;
  readonly productLink: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    //There are some hidden products on the product listing page. Make sure to select only visible products.
    this.productCard = this.page.locator(".product-items:not(.no-display)").locator(".product-item-info");
    this.productLink = this.page.locator(".product-item-link");
  }

  async goToProductDetails(product: Locator) {
    const productTitle = product.locator(this.productLink);
    await productTitle.click();
  }

  async getProductName(product: Locator) {
    const productTitle = product.locator(this.productLink);
    const productName = ((await productTitle.textContent()) ?? "").trim();
    return productName;
  }

  async selectAProduct(isRandomlySelected: boolean = false) {
    let product = this.productCard.first();
    // If isRandomlySelected is true, choose a random product from the list
    if (isRandomlySelected) {
      let productCount = await this.productCard.count();
      if (productCount !== 0) {
        const randomIndex = Math.floor(Math.random() * productCount);
        product = this.productCard.nth(randomIndex);
      }
    }
    return product;
  }
}
