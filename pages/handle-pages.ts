import { test as base } from '@playwright/test';
import { Basket } from "./basket";
import { PaymentsPage } from "./checkout-payments-page";
import { ShippingPage } from "./checkout-shipping-page";
import { Filters } from "./filters";
import { HomePage } from "./home-page";
import { ProductDetailsPage } from "./product-details-page";
import { ProductListing } from "./product-listing-page";
import { Ads } from '../helpers/ads';
import { Loader } from '../helpers/loader';
import { Cookies } from '../helpers/cookies';

type PageList = {
    basket: Basket;
    checkoutPayments: PaymentsPage;
    checkoutShipping: ShippingPage;
    homePage: HomePage;
    pageFilters: Filters;
    productDetailsPage: ProductDetailsPage;
    productListing: ProductListing;
    ads: Ads;
    cookies: Cookies;
    loader: Loader;
    shippingPage: ShippingPage;

};

export const test = base.extend<PageList>({
    basket: async ({ page, context }, use) => {
        await use(new Basket(page));
    },
    checkoutPayments: async ({ page }, use) => {
        await use(new PaymentsPage(page));
    },
    checkoutShipping: async ({ page }, use) => {
        await use(new ShippingPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    pageFilters: async ({ page }, use) => {
        await use(new Filters(page));
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
    loader: async ({ page }, use) => {
        await use(new Loader(page));
    },
    shippingPage: async ({ page }, use) => {
        await use(new ShippingPage(page));
    }

});
export { expect } from '@playwright/test';