import { expect, Locator, Page } from "@playwright/test";
import { Loader } from "../helpers/loader";

export class PaymentsPage {
    readonly page: Page
    readonly totalPrice: Locator;
    readonly summaryBlock: Locator;
    readonly paymentGroup: Locator;
    readonly discountHeading: Locator;
    readonly discountCode: Locator;
    readonly successMessage: Locator;
    readonly loader: Loader;

    constructor(page: Page) {
        this.page = page;
        this.loader = new Loader(page);
        this.summaryBlock = this.page.locator(".opc-block-summary")
        this.paymentGroup = this.page.locator(".payment-group")
        this.totalPrice = this.page.locator('[data-th="Order Total"]');
        this.discountHeading = this.page.locator("#block-discount-heading")
        this.discountCode = this.page.locator("#discount-code")
        this.successMessage = this.page.getByTestId("checkout-cart-validationmessages-message-success")

    }

    async VerifyThePaymentsPageOpened() {
        await this.loader.waitForLoaders()
        await expect(this.loader.loader).toBeHidden()
        await expect(this.paymentGroup).toBeVisible()
    }

    async verifyOrderTotal(itemPrice: number, quantity: number, shippingPrice: number, discount: number = 0) {
        await this.loader.waitForLoaders()
        const productTotal = itemPrice * quantity
        const discountRate = (1 - discount)

        let calculatedOrderTotal = (productTotal * discountRate) + shippingPrice;
        const orderTotalText = await this.totalPrice.textContent()

        let orderTotal = parseFloat(orderTotalText ? orderTotalText.replace("$", "").trim() : "0");
        expect(orderTotal).toEqual(calculatedOrderTotal)
    }

    async applyDiscount(discountCode: string) {
        await this.discountHeading.click();
        await this.discountCode.fill(discountCode);
        await this.discountCode.press('Enter');
        await expect(this.successMessage).toBeVisible();
        await this.loader.waitForLoaders();
        await expect(this.discountCode).toBeDisabled();
    }
}