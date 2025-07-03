import { test, expect } from "@playwright/test";
import { PageNavigation } from "../pages/navigation";
import { Cookies } from "../helpers/cookies";
import { Filter, Filters } from "../pages/filters";
import { TestData } from "../helpers/test-data";
import { Ads } from "../helpers/ads";
import { ProductListing } from "../pages/product-listing-page";
import { ProductDetailsPage } from "../pages/product-details-page";
import { Basket } from "../pages/basket";
import { ShippingPage } from "../pages/checkout-shipping-page";
import { PaymentsPage } from "../pages/checkout-payments-page";
import { Loader } from "../helpers/loader";

export interface Product {
  mainCategory: string;
  category: string;
  filters: Filter[];
  isRandomlySelected: boolean;
  quantity: string;
  discountCode: string;
  shippingDestination: string;
  shippingMethod: string;
}

let pageNavigation: PageNavigation;
let pageFilters: Filters;
let cookies: Cookies;
let ads: Ads;
let productListing: ProductListing;
let productDetailsPage: ProductDetailsPage;
let basket: Basket;
let shippingPage: ShippingPage;
let paymentsPage: PaymentsPage;
let loader: Loader;

const products: Product[] = TestData.getJson("products");

test.describe("Product filtering and checkout with applying discount", () => {
  test.beforeEach("Visit the website", async ({ page, context }) => {
    pageNavigation = new PageNavigation(page);
    cookies = new Cookies(context);
    pageFilters = new Filters(page);
    ads = new Ads(context);
    productListing = new ProductListing(page);
    productDetailsPage = new ProductDetailsPage(page);
    basket = new Basket(page);
    shippingPage = new ShippingPage(page);
    paymentsPage = new PaymentsPage(page);
    loader = new Loader(page);

    await test.step("Block ads and handle cookies", async () => {
      await ads.blockAds();
      await cookies.handleCookies();
      await page.addLocatorHandler(loader.loader, async () => {
        await page.evaluate(() => loader.waitForLoaders());
      }, { noWaitAfter: true });
    });


    await test.step("Navigate to the home page", async () => {
      await page.goto("/");
    });
  });

  for (const product of products) {
    test(`Navigate menu items ${product.mainCategory} > ${product.category}, apply filters on product listing page and add item to the cart`, async ({ page }) => {
      await test.step(`Navigate to the product listing page: ${product.mainCategory} > ${product.category}`, async () => {
        await pageNavigation.clickMainMenuItem(product.mainCategory);
        await pageFilters.filterByMainCategory(product.category);
      });

      await test.step(`Apply filters`, async () => {
        if (product.filters && product.filters.length > 0) {
          for (const filter of product.filters) {
            await test.step(`Apply filter ${filter.name}: ${filter.value}`, async () => {
              await pageFilters.filterBy(filter.name, filter.value);
              await pageFilters.verifyFilterAppliedOnFilterList(filter.name, filter.value);
            });
          }
        }
      });

      let productName = "";
      await test.step(`Add ${product.isRandomlySelected ? "a random" : "first"} product to the cart`, async () => {
        productName = await productListing.selectAProduct(product.isRandomlySelected);
      });

      await test.step(`Verify product details page is opened for ${productName}`, async () => {
        await productDetailsPage.verifyCorrectProductPageOpened(productName);
      });

      await test.step(`Select product variants applied in filters.`, async () => {
        if (product.filters && product.filters.length > 0) {
          for (const filter of product.filters) {
            if (filter.isProductVariant) {
              await test.step(`Select product variant if applicable`, async () => {
                await productDetailsPage.selectProductVariant(filter.value);
              });
            }
          }
        }
      });

      await test.step(`Set product quantity to ${product.quantity}`, async () => {
        await productDetailsPage.setProductQuantity(product.quantity);
      });

      const productPrice = await productDetailsPage.getProductPrice();

      await test.step(`Add ${product.quantity} product to the cart`, async () => {
        await productDetailsPage.addProductToCart();
      });

      await test.step(`Verify basket icon quantity is ${product.quantity}`, async () => {
        await basket.verifyBasketIconQuantity(product.quantity);
      });

      await test.step(`Click basket icon and verify product is added to the cart`, async () => {
        await basket.verifyProductAddedToCart(product.quantity, productPrice, productName);
      });

      await test.step(`Proceed to checkout`, async () => {
        await basket.clickCheckoutButton();
      });

      await test.step(`Verify shipping address form is displayed`, async () => {
        await loader.waitForLoaders();
        await shippingPage.verifyShippingAddressFormIsDisplayed();
      });

      await test.step(`Fill shipping address with random values ans select the shipping destination ${product.shippingDestination}`, async () => {
        const shippingAddress = shippingPage.generateRandomShippingAddress();
        shippingAddress.country = product.shippingDestination;
        await shippingPage.fillShippingAddress(shippingAddress);
      });

      let shippingCosts = 0;
      await test.step(`Select shipping method`, async () => {
        shippingCosts = await shippingPage.selectShippingMethodandReturnCost(product.shippingMethod);
      });

      await test.step(`Click next button and verify the Review and Payments page is opened`, async () => {
        await shippingPage.clickNextButton();
        await loader.waitForLoaders();
        await paymentsPage.VerifyThePaymentsPageOpened();
      });

      await test.step(`Verify that the order total cost is correct`, async () => {
        const parsedQuantity = parseInt(product.quantity, 10);
        await paymentsPage.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts);
      });
    });
  }
});