import { Locator, Page } from 'playwright';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  protected async waitForLocator(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  protected async fillField(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  protected async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: `test-results/${name}.png` });
  }
}
