import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../../../support/world';
import { BookStorePage } from '../../../pages/BookStorePage';

Given('the user is on the book store page', async function (this: CustomWorld) {
  await this.getPage(BookStorePage).navigateToBookStore();
  await this.getPage(BookStorePage).assertBookStoreLoaded();
});

When('the user searches for {string}', async function (this: CustomWorld, keyword: string) {
  await this.getPage(BookStorePage).searchForKeyword(keyword);
});

Then(
  'at least one book is displayed in the results',
  async function (this: CustomWorld) {
    await this.getPage(BookStorePage).assertResultsFound();
  },
);

Then('no books are found in the search results', async function (this: CustomWorld) {
  await this.getPage(BookStorePage).assertNoResultsFound();
});
