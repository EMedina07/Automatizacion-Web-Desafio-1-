import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { IAttachFn } from '../../core/framework_actions/StepLogger';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  consoleLogs: string[] = [];
  readonly stepCounter = { value: 0 };

  private readonly pageCache = new Map<Function, unknown>();

  constructor(options: IWorldOptions) {
    super(options);
  }

  getPage<T>(PageClass: new (page: Page, attachFn?: IAttachFn, stepCounter?: { value: number }) => T): T {
    if (!this.pageCache.has(PageClass)) {
      this.pageCache.set(
        PageClass,
        new PageClass(this.page, this.attach.bind(this) as IAttachFn, this.stepCounter),
      );
    }
    return this.pageCache.get(PageClass) as T;
  }
}

setWorldConstructor(CustomWorld);
