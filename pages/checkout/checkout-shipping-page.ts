import { expect, Locator, Page } from "@playwright/test";
import { fakerNL } from '@faker-js/faker';

export interface ShippingForm {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    state?: string;
    telephone: string;
}


export class ShippingPage {

    readonly page: Page;
    readonly formContainer: Locator;
    readonly loginForm: Locator;
    readonly shippingAddressForm: Locator;
    readonly emailInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly streetInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly postcodeInput: Locator;
    readonly countryInput: Locator;
    readonly telephoneInput: Locator;
    readonly shippingMethodTable: Locator;
    readonly checkoutShippingLoaded: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.formContainer = this.page.locator("#checkout-step-shipping");
        this.loginForm = this.formContainer.locator(".form-login");
        this.shippingAddressForm = this.formContainer.locator(".form-shipping-address");
        this.emailInput = this.page.getByRole('textbox', { name: 'Email Address * Email Address' })
        this.firstNameInput = this.page.getByRole('textbox', { name: 'First Name *' })
        this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name *' })
        this.companyInput = this.page.getByRole('textbox', { name: 'Company' })
        this.streetInput = this.page.getByRole('textbox', { name: 'Street Address: Line 1' })
        this.cityInput = this.page.getByRole('textbox', { name: 'City *' })
        this.stateInput = this.page.getByRole('textbox', { name: 'State/Province' })
        this.postcodeInput = this.page.getByRole('textbox', { name: 'Zip/Postal Code *' })
        this.countryInput = this.page.getByLabel('Country')
        this.telephoneInput = this.page.getByRole('textbox', { name: 'Phone Number *' })
        this.checkoutShippingLoaded = this.page.locator('#checkout-shipping-method-load')
        this.nextButton = this.page.getByRole('button', { name: 'Next' })

    }


    generateRandomShippingAddress(): ShippingForm {
        return {
            email: fakerNL.internet.email(),
            firstName: fakerNL.person.firstName(),
            lastName: fakerNL.person.lastName(),
            company: fakerNL.company.name(),
            street: fakerNL.location.streetAddress(),
            city: fakerNL.location.city(),
            postcode: fakerNL.location.zipCode(),
            country: fakerNL.location.country(),
            state: fakerNL.location.state(),
            telephone: fakerNL.phone.number(),
        };
    }

    async verifyShippingAddressFormIsDisplayed() {
        await expect(this.shippingAddressForm).toBeVisible();
    }

    async fillShippingAddress(formData: ShippingForm) {
        await this.emailInput.fill(formData.email);
        await this.firstNameInput.fill(formData.firstName);
        await this.lastNameInput.fill(formData.lastName);
        if (formData.company) {
            await this.companyInput.fill(formData.company);
        }
        await this.countryInput.selectOption({ label: formData.country });
        await this.streetInput.fill(formData.street);
        await this.cityInput.fill(formData.city);
        if (formData.state) {
            await this.stateInput.fill(formData.state);
        }
        await this.postcodeInput.fill(formData.postcode);
        await this.telephoneInput.fill(formData.telephone);
    }

    async selectShippingMethodandReturnCost(methodName: string) {
        await this.checkoutShippingLoaded.waitFor({ state: "visible" })
        const shippingMethod = this.page.getByRole('radio', { name: methodName })
        await shippingMethod.click();
        const shippingCostResult = this.checkoutShippingLoaded.locator(".row").filter({ hasText: methodName }).locator(".col-price")

        const costText = await shippingCostResult.textContent();
        const cost = parseFloat(costText ? costText.replace("$", "").trim() : "");
        return cost;
    }

    async clickNextButton() {
        await this.nextButton.click();
    }
}