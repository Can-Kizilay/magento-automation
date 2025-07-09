import { Filter } from "../pages/product-listing/filters";
import { products } from "../test-data/products.json";
import { test } from '../fixtures/page-objects';

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


test.describe("Product filtering and checkout with applying discount", () => {
  test.beforeEach("Test setup", async ({ page, ads, cookies, homePage }) => {

    // ads and cookies handling
    await ads.blockAds();
    await cookies.handleCookies();

    //Locator handler to wait for the loading mask to disappear
    await page.addLocatorHandler(page.locator('loading-mask'), async () => {
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");
    });

    // Navigate to the home page
    await homePage.navigateToHomePage();
    await homePage.verifyHomePage();
  });

  // Iterate through each product in the products array
  for (const product of products) {
    test(`Navigate menu items ${product.mainCategory} > ${product.category}, apply filters on product listing page and add item to the cart`,
      async ({
        // Page objects
        navigation,
        pageFilters,
        productListing,
        productDetailsPage,
        basket,
        checkoutShipping,
        checkoutPayments,
      }) => {

        // Navigate to the product listing page
        await navigation.clickNavigationMenuItem(product.mainCategory);

        // Filter by the main category
        await pageFilters.filterByMainCategory(product.category);

        // Apply filters & verify that the filters are applied
        await pageFilters.applyAndVerifyAllFilters(product.filters);

        // Select a product from the product listing page
        const productName = await productListing.selectAProduct(product.isRandomlySelected);

        // Verify that the correct product page is opened
        await productDetailsPage.verifyCorrectProductPageOpened(productName);

        // Select all product variants if they are defined
        await productDetailsPage.selectAllProductVariants(product.filters ?? []);

        // Set the product quantity
        await productDetailsPage.setProductQuantity(product.quantity);

        // Get the product price
        const productPrice = await productDetailsPage.getProductPrice();

        // Add the product to the cart
        await productDetailsPage.addProductToCart();

        // Verify that the product is added to the cart
        await basket.verifyBasketIconQuantity(product.quantity);

        // Verify that the product is added to the cart with correct details
        await basket.verifyProductAddedToCart(product.quantity, productPrice, productName);

        // Click the checkout button
        await basket.clickCheckoutButton();

        // Verify that the shipping page is opened
        await checkoutShipping.verifyShippingAddressFormIsDisplayed();

        // Fill the shipping address and select the shipping method
        const shippingAddress = checkoutShipping.generateRandomShippingAddress();

        // Set the shipping address details
        shippingAddress.country = product.shippingDestination;
        await checkoutShipping.fillShippingAddress(shippingAddress);

        // Select the shipping method and return the shipping costs
        const shippingCosts = await checkoutShipping.selectShippingMethodandReturnCost(product.shippingMethod);

        await checkoutShipping.clickNextButton();

        // Verify that the payments page is opened
        await checkoutPayments.VerifyThePaymentsPageOpened();

        const parsedQuantity = parseInt(product.quantity, 10);
        // Verify the order total on the payments page
        await checkoutPayments.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts);

        // Apply the discount code
        await checkoutPayments.applyDiscount(product.discountCode)

        // Verify the order total after applying the discount code
        await checkoutPayments.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts, product.discountRate);
      });
  }
});