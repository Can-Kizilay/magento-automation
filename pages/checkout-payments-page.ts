import { expect, Locator, Page } from "@playwright/test";

export class PaymentsPage {
    readonly page: Page
    readonly totalPrice: Locator;
    readonly summaryBlock: Locator;
    readonly paymentGroup: Locator;
    // readonly loader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.summaryBlock = this.page.locator(".opc-block-summary")
        this.paymentGroup = this.page.locator(".payment-group")
        this.totalPrice = this.page.locator('[data-th="Order Total"]');
    }

    async VerifyThePaymentsPageOpened() {
        await expect(this.summaryBlock).toBeVisible()
        await expect(this.paymentGroup).toBeVisible()
    }

    async verifyOrderTotal(itemPrice: number, quantity: string, shippingPrice: number) {
        let parsedQuantity = parseInt(quantity, 10);
        let calculatedOrderTotal = (itemPrice * parsedQuantity) + shippingPrice;
        const orderTotalText = await this.totalPrice.textContent()

        let orderTotal = parseFloat(orderTotalText ? orderTotalText.replace("$", "").trim() : "");
        expect(orderTotal).toEqual(calculatedOrderTotal)

    }
}