import { expect, Locator, Page } from "@playwright/test";

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
    this.addToCartButton = this.page.locator("button[title='Add to Cart']");
    this.productPrice = this.page.locator(".product-info-main").locator(".price");
  }

  async verifyCorrectProductPageOpened(productName: string) {

    await expect(this.productTitle).toHaveText(productName);
    await expect(this.addToCartButton).toBeEnabled(); // Ensure the button is enabled before clicking

  }

  async selectProductVariant(variantName: string, variantValue: string) {
    const variantContainer = this.page.locator(`[attribute-code=${variantName.toLocaleLowerCase()}]`);
    const variantToSelect = variantContainer.getByLabel(variantValue);

    await expect(variantContainer).toBeVisible();
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
