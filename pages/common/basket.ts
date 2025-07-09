import { expect, Locator, Page } from "@playwright/test";

export class Basket {
    readonly page: Page;
    readonly basketIcon: Locator;
    readonly cartContentWrapper: Locator;
    readonly basketIconCounter: Locator;
    readonly cartItem: Locator;
    readonly cartItemTotalPrice: Locator;
    readonly cartItemQuantity: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.basketIcon = this.page.locator(".minicart-wrapper");
        this.cartContentWrapper = this.page.locator("#minicart-content-wrapper");
        this.basketIconCounter = this.basketIcon.locator(".counter");
        this.cartItem = this.cartContentWrapper.locator(".product-item-name");
        this.cartItemTotalPrice = this.cartContentWrapper.locator(".subtotal").locator(".price");
        this.cartItemQuantity = this.cartContentWrapper.locator(".count");
        this.checkoutButton = this.cartContentWrapper.locator("#top-cart-btn-checkout");
    }

    async verifyBasketIconQuantity(quantity: string) {

        await expect(this.basketIconCounter).toBeEnabled();
        await expect(this.basketIconCounter).toContainText(quantity); // Ensure the cart icon counter reflects the added quantity
    }


    async verifyProductAddedToCart(quantity: string, price: number, productName: string) {
        await this.basketIcon.click();
        let totalPrice = this.calculateTotalPrice(quantity, price);
        await expect(this.cartContentWrapper).toBeVisible();
        await expect(this.cartItem).toHaveText(productName);
        await expect(this.cartItemTotalPrice).toHaveText(totalPrice);
        await expect(this.cartItemQuantity).toHaveText(quantity);
    }

    calculateTotalPrice(quantity: string, price: number): string {
        const quantityValue = parseInt(quantity, 10);
        const totalPrice = (price * quantityValue).toFixed(2);
        return `$${totalPrice}`;
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click();
    }
}