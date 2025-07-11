import { expect, Locator, Page } from "@playwright/test";
import { Filter } from "../../interfaces/filter";
import { test } from "../../fixtures/page-objects";

export class Filters {
  readonly page: Page;
  readonly categoryFilter: Locator;
  readonly filterGroup: Locator;
  readonly filterLabel: Locator;
  readonly filterValue: Locator;
  readonly currentFitlers: Locator;
  readonly mobileFilterButton: Locator;
  readonly currentFiltersMobile: Locator;
  readonly pageviewPort: number;
  readonly isMobile: boolean;

  constructor(page: Page, isMobile: boolean = false) {
    this.page = page;
    this.isMobile = isMobile;
    this.categoryFilter = this.page.locator(".options");
    this.filterGroup = this.page.locator(".filter-options-item");
    this.currentFitlers = this.page.locator(".filter-current");
    this.mobileFilterButton = this.page.getByRole('tab', { name: 'Shop By' });
    this.pageviewPort = this.page.viewportSize()?.width ?? 1980;
    this.currentFiltersMobile = this.page.getByRole('tab', { name: 'Now Shopping by' });
    this.filterLabel = this.page.locator(".filter-label");
    this.filterValue = this.page.locator(".filter-value");
  }

  async filterByMainCategory(categoryName: string) {
    const mobileMenuItem = this.page.getByRole('menuitem', { name: categoryName });
    // Check if the page opened in mobile view
    if (this.isMobile) {
      await mobileMenuItem.click()
    } else {
      await this.categoryFilter.getByText(categoryName, { exact: true }).click();
    }
  }

  async applyAndVerifyAllFilters(filters: Filter[]) {
    for (const filter of filters) {
      await this.filterBy(filter.name, filter.value);
      await this.verifyFilterAppliedOnFilterList(filter.name, filter.value);
    }
  };

  async filterBy(filterName: string, filterValue: string) {
    const filter = this.page.getByRole("tab", { name: filterName });
    const selectedFilter = this.filterGroup.filter({ has: filter });

    if (this.isMobile) {
      await this.mobileFilterButton.click() // Click filter button before applying filters on mobile
    }
    await filter.click();
    if (filterName.toLowerCase() === "color") {
      await selectedFilter.getByLabel(filterValue).locator("div").click();
    } else {
      await selectedFilter.getByText(filterValue).click();
    }
  }

  async verifyFilterAppliedOnFilterList(filterName: string, filterValue: string) {

    if (this.isMobile) {
      await this.currentFiltersMobile.click();
    }
    await expect(this.currentFitlers.locator(this.filterLabel).getByText(filterName)).toBeVisible();
    await expect(this.currentFitlers.locator(this.filterValue).getByText(filterValue)).toBeVisible();
  }
}
