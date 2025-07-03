import { expect, Locator, Page } from "@playwright/test";
import { Loader } from "../helpers/loader";

export class PaymentsPage {
    readonly page: Page
    readonly totalPrice: Locator;
    readonly summaryBlock: Locator;
    readonly paymentGroup: Locator;
    readonly loader: Loader;

    constructor(page: Page) {
        this.page = page;
        this.loader = new Loader(page);
        this.summaryBlock = this.page.locator(".opc-block-summary")
        this.paymentGroup = this.page.locator(".payment-group")
        this.totalPrice = this.page.locator('[data-th="Order Total"]');
    }

    async VerifyThePaymentsPageOpened() {
        await this.loader.waitForLoaders()
        await expect(this.loader.loader).toBeHidden()
        await expect(this.paymentGroup).toBeVisible()
    }

    async verifyOrderTotal(itemPrice: number, quantity: number, shippingPrice: number) {
        await this.loader.waitForLoaders()
        let calculatedOrderTotal = (itemPrice * quantity) + shippingPrice;
        const orderTotalText = await this.totalPrice.textContent()

        let orderTotal = parseFloat(orderTotalText ? orderTotalText.replace("$", "").trim() : "");
        expect(orderTotal).toEqual(calculatedOrderTotal)

    }
}