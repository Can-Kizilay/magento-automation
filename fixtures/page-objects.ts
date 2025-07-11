import { test as base } from '@playwright/test';
import { Basket } from "../pages/common/basket";
import { PaymentsPage } from '../pages/checkout/checkout-payments-page';
import { ShippingPage } from '../pages/checkout/checkout-shipping-page';
import { Filters } from "../pages/product-listing/filters";
import { HomePage } from "../pages/common/home-page";
import { Navigation } from '../pages/common/navigation';
import { ProductDetailsPage } from "../pages/product-details/product-details-page";
import { ProductListing } from "../pages/product-listing/product-listing-page";
import { Ads } from '../helpers/ads';
import { Cookies } from '../helpers/cookies';

type PageList = {
    // Page objects
    homePage: HomePage;
    navigation: Navigation
    basket: Basket;
    checkoutPayments: PaymentsPage;
    checkoutShipping: ShippingPage;
    pageFilters: Filters;
    productDetailsPage: ProductDetailsPage;
    productListing: ProductListing;
    shippingPage: ShippingPage;
    // Helper classes
    ads: Ads;
    cookies: Cookies;

};
// Extend the base test with the page objects
export const test = base.extend<PageList>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    navigation: async ({ page, isMobile }, use) => {
        await use(new Navigation(page, isMobile));
    },

    basket: async ({ page }, use) => {
        await use(new Basket(page));
    },

    checkoutPayments: async ({ page }, use) => {
        await use(new PaymentsPage(page));
    },

    checkoutShipping: async ({ page }, use) => {
        await use(new ShippingPage(page));
    },

    pageFilters: async ({ page, isMobile }, use) => {
        await use(new Filters(page, isMobile));
    },

    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },

    productListing: async ({ page }, use) => {
        await use(new ProductListing(page));
    },

    cookies: async ({ context }, use) => {
        await use(new Cookies(context));
    },

    ads: async ({ context }, use) => {
        await use(new Ads(context));
    },

    shippingPage: async ({ page }, use) => {
        await use(new ShippingPage(page));
    },
});
export { expect } from '@playwright/test';