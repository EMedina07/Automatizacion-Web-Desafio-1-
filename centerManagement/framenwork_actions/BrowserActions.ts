import { chromium, Browser, Page } from 'playwright';

export class BrowserActions {
  private static browser: Browser;
  private static page: Page;

  static async getPage() {
    this.browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized"],
    });

    const context = await this.browser.newContext({
      viewport: null,
      deviceScaleFactor: undefined,
    });

    this.page = await context.newPage();
    return this.page;
  }

  static async closeBrowser() {
    await this.browser?.close();
  }
}
