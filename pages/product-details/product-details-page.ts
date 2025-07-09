import { expect, Locator, Page } from "@playwright/test";
import { Filter } from "../product-listing/filters";

export class ProductDetailsPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productQuantity: Locator;
  readonly addToCartButton: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = this.page.getByTestId("page-title-wrapper");
    this.productQuantity = this.page.locator("#qty");
    this.addToCartButton = this.page.getByRole('button', { name: 'Add to Cart' })
    this.productPrice = this.page.locator(".product-info-main").locator(".price");
  }

  async verifyCorrectProductPageOpened(productName: string) {

    await expect(this.productTitle).toBeVisible();
    await expect(this.productTitle).toHaveText(productName);
    await expect(this.addToCartButton).toBeVisible(); // Ensure the button is visible before clicking
    await expect(this.addToCartButton).toBeEnabled(); // Ensure the button is enabled before clicking
  }


  async selectAllProductVariants(productFilters: Filter[]) {
    for (const filter of productFilters) {
      if (filter.isProductVariant) {
        await this.selectProductVariant(filter.value);
      }
    }
  }

  async selectProductVariant(variantValue: string) {
    const variantToSelect = this.page.getByRole('option', { name: variantValue })

    await expect(variantToSelect).toBeVisible();
    await variantToSelect.click();
  }

  async setProductQuantity(quantity: string) {
    await this.productQuantity.fill(quantity);
  }

  async getProductPrice() {
    const priceText = await this.productPrice.textContent();
    let price = 0;
    if (priceText) {
      price = parseFloat(priceText.trim().replace("$", ""))
    }
    return price;
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }
}
