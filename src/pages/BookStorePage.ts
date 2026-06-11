import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { IAttachFn } from '../../core/framework_actions/StepLogger';

const BOOKS_URL = 'https://demoqa.com/books';

export class BookStorePage extends BasePage {
  private readonly searchBox = this.page.locator('#searchBox');
  private readonly bookTableLinks = this.page.locator('.books-wrapper table tbody a');
  private readonly pageHeader = this.page.locator('.main-header');

  constructor(page: Page, attachFn?: IAttachFn, stepCounter?: { value: number }) {
    super(page, attachFn, stepCounter);
  }

  async navigateToBookStore(): Promise<void> {
    await this.navigate(BOOKS_URL);
  }

  async searchForKeyword(keyword: string): Promise<void> {
    await this.waitForLocator(this.searchBox);
    await this.fillField(this.searchBox, keyword, 'Search box');
  }

  async assertBookStoreLoaded(): Promise<void> {
    await this.assertCapture(
      'Book Store page is loaded — search box and book list are visible',
      `expect(#searchBox).toBeVisible() + expect(bookTableLinks.first()).toBeVisible()`,
      async () => {
        await expect(this.searchBox).toBeVisible({ timeout: 15_000 });
        await expect(this.bookTableLinks.first()).toBeVisible({ timeout: 15_000 });
      },
    );
  }

  async assertResultsFound(): Promise<void> {
    await this.assertCapture(
      'At least one book result is displayed in the table',
      `expect(.rt-tbody a).toBeVisible()`,
      async () => {
        await expect(this.bookTableLinks.first()).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  async assertNoResultsFound(): Promise<void> {
    await this.assertCapture(
      'No book results are displayed — table is empty',
      `expect(.rt-tbody a).toHaveCount(0)`,
      async () => {
        await expect(this.bookTableLinks).toHaveCount(0, { timeout: 10_000 });
      },
    );
  }

  async assertResultsContainKeyword(keyword: string): Promise<void> {
    await this.assertCapture(
      `All visible book titles contain the keyword "${keyword}"`,
      `expect each .rt-tbody a to contain text '${keyword}'`,
      async () => {
        const count = await this.bookTableLinks.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
          const title = await this.bookTableLinks.nth(i).textContent();
          expect(title?.toLowerCase()).toContain(keyword.toLowerCase());
        }
      },
    );
  }
}
