import { expect, Locator, Page } from "@playwright/test";

export interface Filter {
  name: string;
  value: string;
  isProductVariant?: boolean;
}

export class Filters {
  readonly page: Page;
  readonly categoryFilter: Locator;
  readonly filterGroup: Locator;
  readonly currentFitlers: Locator;
  readonly mobileFilterButton: Locator;
  readonly currentFiltersMobile: Locator;
  readonly pageviewPort: number;

  constructor(page: Page) {
    this.page = page;
    this.categoryFilter = this.page.locator(".options");
    this.filterGroup = this.page.locator(".filter-options-item");
    this.currentFitlers = this.page.locator(".filter-current");
    this.mobileFilterButton = this.page.getByRole('tab', { name: 'Shop By' });
    this.pageviewPort = this.page.viewportSize()?.width ?? 1980;
    this.currentFiltersMobile = this.page.getByRole('tab', { name: 'Now Shopping by' });
  }

  async filterByMainCategory(categoryName: string) {
    const mobileMenuItem = this.page.getByRole('menuitem', { name: categoryName });
    if (await mobileMenuItem.isVisible()) {
      await this.page.getByRole('menuitem', { name: categoryName }).click()
    } else {
      await this.categoryFilter.getByText(categoryName, { exact: true }).click();

    }

  }

  getFilterName(filterName: string) {
    return this.page.getByRole("tab", { name: filterName });
  }

  async filterBy(filterName: string, filterValue: string) {
    const filter = this.getFilterName(filterName);
    const fitlers = this.filterGroup.filter({ has: filter });


    if (this.pageviewPort && this.pageviewPort < 768) {
      await this.mobileFilterButton.click() // Click filter button before applying filters on mobile
    }
    await filter.click();
    if (filterName.toLowerCase() === "color") {
      await fitlers.getByLabel(filterValue).locator("div").click();
    } else {
      await fitlers.getByText(filterValue).click();
    }
  }

  async verifyFilterAppliedOnFilterList(filterName: string, filterValue: string) {

    await expect(this.currentFiltersMobile).toBeEnabled();
    await this.currentFiltersMobile.click();
    await expect(this.currentFitlers.locator(".filter-label").getByText(filterName)).toBeVisible();
    await expect(this.currentFitlers.locator(".filter-value").getByText(filterValue)).toBeVisible();
  }
}
