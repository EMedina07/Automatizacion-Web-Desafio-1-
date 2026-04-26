import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  consoleLogs: string[] = [];

  private readonly pageCache = new Map<new (page: Page) => unknown, unknown>();

  constructor(options: IWorldOptions) {
    super(options);
  }

  getPage<T>(PageClass: new (page: Page) => T): T {
    if (!this.pageCache.has(PageClass)) {
      this.pageCache.set(PageClass, new PageClass(this.page));
    }
    return this.pageCache.get(PageClass) as T;
  }
}

setWorldConstructor(CustomWorld);
