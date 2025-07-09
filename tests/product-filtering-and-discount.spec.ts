import { HomePage } from "../pages/home-page";
import { Cookies } from "../helpers/cookies";
import { Filter, Filters } from "../pages/filters";
import { Ads } from "../helpers/ads";
import { ProductListing } from "../pages/product-listing-page";
import { ProductDetailsPage } from "../pages/product-details-page";
import { Basket } from "../pages/basket";
import { ShippingPage } from "../pages/checkout-shipping-page";
import { PaymentsPage } from "../pages/checkout-payments-page";
import { Loader } from "../helpers/loader";
import { products } from "../test-data/products.json";
import { test, expect } from '../pages/handle-pages';

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

let homePage: HomePage;
let pageFilters: Filters;
let cookies: Cookies;
let ads: Ads;
let productListing: ProductListing;
let productDetailsPage: ProductDetailsPage;
let basket: Basket;
let shippingPage: ShippingPage;
let paymentsPage: PaymentsPage;
let loader: Loader;

test.describe("Product filtering and checkout with applying discount", () => {
  test.beforeEach("Visit the website", async ({ page, context }) => {
    homePage = new HomePage(page);
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

    homePage.navigateToHomePage();
  });

  for (const product of products) {
    test(`Navigate menu items ${product.mainCategory} > ${product.category}, apply filters on product listing page and add item to the cart`, async ({ page }) => {

      // Navigate to the product listing page
      await homePage.clickNavigationMenuItem(product.mainCategory);

      // Filter by the main category
      await pageFilters.filterByMainCategory(product.category);

      // Apply filters if they are defined for the product
      await pageFilters.applyAllFilters(product.filters);

      // Select a product from the product listing page
      let productName = "";
      productName = await productListing.selectAProduct(product.isRandomlySelected);

      // Verify that the correct product page is opened
      await productDetailsPage.verifyCorrectProductPageOpened(productName);

      await productDetailsPage.selectAllProductVariants(product.filters ?? []);



      await productDetailsPage.setProductQuantity(product.quantity);


      const productPrice = await productDetailsPage.getProductPrice();


      await productDetailsPage.addProductToCart();


      await basket.verifyBasketIconQuantity(product.quantity);



      await basket.verifyProductAddedToCart(product.quantity, productPrice, productName);



      await basket.clickCheckoutButton();



      await loader.waitForLoaders();
      await shippingPage.verifyShippingAddressFormIsDisplayed();


      const shippingAddress = shippingPage.generateRandomShippingAddress();
      shippingAddress.country = product.shippingDestination;
      await shippingPage.fillShippingAddress(shippingAddress);


      let shippingCosts = 0;

      shippingCosts = await shippingPage.selectShippingMethodandReturnCost(product.shippingMethod);


      await shippingPage.clickNextButton();
      await loader.waitForLoaders();
      await paymentsPage.VerifyThePaymentsPageOpened();

      let parsedQuantity = 0

      parsedQuantity = parseInt(product.quantity, 10);
      await paymentsPage.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts);


      await paymentsPage.applyDiscount(product.discountCode)
      await paymentsPage.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts, product.discountRate);
    });
  }
});