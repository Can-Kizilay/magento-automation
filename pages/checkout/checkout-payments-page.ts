import { expect, Locator, Page } from "@playwright/test";
import { test } from "../../fixtures/page-objects";


export class PaymentsPage {
    readonly page: Page
    readonly totalPrice: Locator;
    readonly summaryBlock: Locator;
    readonly paymentGroup: Locator;
    readonly discountHeading: Locator;
    readonly discountCodeInput: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.summaryBlock = this.page.locator(".opc-block-summary")
        this.paymentGroup = this.page.locator(".payment-group")
        this.totalPrice = this.page.locator('[data-th="Order Total"]');
        this.discountHeading = this.page.locator("#block-discount-heading")
        this.discountCodeInput = this.page.locator("#discount-code")
        this.successMessage = this.page.getByTestId("checkout-cart-validationmessages-message-success")

    }

    async VerifyThePaymentsPageOpened() {
        await expect(this.paymentGroup).toBeVisible()
    }

    async verifyOrderTotal(itemPrice: number, quantity: number, shippingPrice: number, discount: number = 0) {

        const calculatedOrderTotal = await this.calculateOrderTotal(itemPrice, quantity, shippingPrice, discount);
        const orderTotalText = await this.totalPrice.textContent()
        const orderTotal = parseFloat(orderTotalText ? orderTotalText.replace("$", "").trim() : "0");

        expect(orderTotal).toEqual(calculatedOrderTotal)
    }

    async calculateOrderTotal(itemPrice: number, quantity: number, shippingPrice: number, discount: number = 0) {
        const productTotal = itemPrice * quantity
        const discountRate = (1 - discount)

        return (productTotal * discountRate) + shippingPrice;
    }
    async applyDiscount(discountCode: string) {
        await this.discountHeading.click();
        await this.discountCodeInput.fill(discountCode);
        await this.discountCodeInput.press('Enter');
        // The success message clashes with the loader listener. 
        // When load times increase, the success message disappears before the network requests are fully completed.
        // So I keep it commented out for now.
        // await expect(this.successMessage).toBeVisible();
        await expect(this.discountCodeInput).toBeDisabled();
    }
}