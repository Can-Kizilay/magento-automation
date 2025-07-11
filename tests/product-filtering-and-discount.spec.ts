import { products } from "../test-data/products.json";
import { test } from '../fixtures/page-objects';
import { Product } from "../interfaces/product";

test.describe("Product filtering and checkout with applying discount", () => {
  test.beforeEach("Test setup", async ({ page, ads, cookies, homePage }) => {

    // ads and cookies handling
    await ads.blockAds();
    await cookies.handleCookies();

    //Locator handler to wait for the loading mask to disappear
    await page.addLocatorHandler(page.locator('.loading-mask').first(), async () => {
      await page.waitForLoadState("networkidle");
    });

    // Navigate to the home page
    await homePage.navigateToHomePage();
    await homePage.verifyPageTitle("Home Page");
  });

  // Iterate through each product in the products array
  const productList: Product[] = products;

  for (const product of productList) {
    test(`Navigate menu items ${product.mainCategory} > ${product.category}, apply filters on product listing page and add item to the cart`,
      async ({
        // Page objects
        homePage,
        navigation,
        pageFilters,
        productListing,
        productDetailsPage,
        basket,
        checkoutShipping,
        checkoutPayments,
        isMobile
      }) => {

        await test.step(`Navigate to the product listing page: ${product.mainCategory} > ${product.category}`, async () => {
          await navigation.clickNavigationMenuItem(product.mainCategory);
          if (!isMobile) {
            //This step is needed only for desktop view
            await homePage.verifyPageTitle(product.mainCategory);
          }
          await pageFilters.filterByMainCategory(product.category);
          await homePage.verifyPageTitle(product.category);
        });

        await test.step(`Apply filters`, async () => {
          await pageFilters.applyAndVerifyAllFilters(product.filters);
        });

        let productName = ""

        await test.step(`Open ${product.isRandomlySelected ? "a random" : " the first"} product.`, async () => {
          const productCard = await productListing.selectAProduct(product.isRandomlySelected);
          productName = await productListing.getProductName(productCard);
          await productListing.goToProductDetails(productCard);
        });

        await test.step(`Verify product details page is opened for the product: ${productName}`, async () => {
          await productDetailsPage.verifyCorrectProductPageOpened(productName);
        });

        await test.step(`Select product variants applied in filters.`, async () => {
          await productDetailsPage.selectAllProductVariants(product.filters ?? []);
        })

        await test.step(`Set product quantity to ${product.quantity}`, async () => {
          await productDetailsPage.setProductQuantity(product.quantity);
        });

        let productPrice = 0;
        await test.step(`Get product price`, async () => {
          productPrice = await productDetailsPage.getProductPrice();
        });

        await test.step(`Add ${product.quantity} product to the cart`, async () => {
          await productDetailsPage.addProductToCart();
        });

        await test.step(`Verify basket icon quantity is ${product.quantity}`, async () => {
          await basket.verifyBasketIconQuantity(product.quantity);
        });

        await test.step(`Click basket icon and verify product is added to the cart`, async () => {
          await basket.verifyProductAddedToCart(product.quantity, productPrice, productName);
        })

        await test.step(`Proceed to checkout`, async () => {
          await basket.clickCheckoutButton();
        });

        await test.step(`Verify shipping address form is displayed`, async () => {
          await checkoutShipping.verifyShippingAddressFormIsDisplayed();
        });

        await test.step(`Fill shipping address with random values ans select the shipping destination ${product.shippingDestination}`, async () => {
          const shippingAddress = checkoutShipping.generateRandomShippingAddress();

          // Set the shipping country
          shippingAddress.country = product.shippingDestination;
          await checkoutShipping.fillShippingAddress(shippingAddress);
        });

        let shippingCosts = 0;

        await test.step(`Select shipping method and return the shipping costs`, async () => {
          await checkoutShipping.selectShippingMethod(product.shippingMethod);
          shippingCosts = await checkoutShipping.getShippingCost(product.shippingMethod);
        });

        await test.step(`Click next button and verify the Review and Payments page is opened`, async () => {
          await checkoutShipping.clickNextButton();
          await checkoutPayments.VerifyThePaymentsPageOpened();
        });

        const parsedQuantity = parseInt(product.quantity, 10);

        await test.step(`Verify that the order total cost is correct`, async () => {
          await checkoutPayments.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts);
        });

        await test.step(`Apply the discount code: ${product.discountCode} and verify the discounted price`, async () => {
          await checkoutPayments.applyDiscount(product.discountCode)
        });

        await test.step(`Verify the order total after applying the discount code`, async () => {
          await checkoutPayments.verifyOrderTotal(productPrice, parsedQuantity, shippingCosts, product.discountRate);
        });

      });
  }
});