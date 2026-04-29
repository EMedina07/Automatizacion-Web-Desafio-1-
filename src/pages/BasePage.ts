import { Locator, Page } from 'playwright';
import { IAttachFn, ActionType, renderCard } from '../../core/framework_actions/StepLogger';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    private readonly attachFn?: IAttachFn,
    private readonly stepCounter?: { value: number },
  ) {}

  private async captureAction(
    type: ActionType,
    description: string,
    code: string,
    action: () => Promise<void>,
  ): Promise<void> {
    await action();
    if (!this.attachFn || !this.stepCounter) return;
    try {
      const screenshot = await this.page.screenshot({ fullPage: false });
      this.stepCounter.value++;
      const card = renderCard(this.stepCounter.value, type, description, code, screenshot, false);
      await this.attachFn(card, 'text/html');
    } catch {}
  }

  protected async assertCapture(
    description: string,
    code: string,
    assertion: () => Promise<void>,
  ): Promise<void> {
    let failed = false;
    let thrownError: unknown;

    try {
      await assertion();
    } catch (e) {
      failed = true;
      thrownError = e;
    }

    if (this.attachFn && this.stepCounter) {
      try {
        const screenshot = await this.page.screenshot({ fullPage: false });
        this.stepCounter.value++;
        const card = renderCard(this.stepCounter.value, 'ASSERT', description, code, screenshot, failed);
        await this.attachFn(card, 'text/html');
      } catch {}
    }

    if (thrownError) throw thrownError;
  }

  protected async actionCapture(
    description: string,
    code: string,
    action: () => Promise<void>,
  ): Promise<void> {
    await this.captureAction('ACTION', description, code, action);
  }

  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  protected async captureCurrentState(
    type: ActionType,
    description: string,
    code: string,
  ): Promise<void> {
    if (!this.attachFn || !this.stepCounter) return;
    try {
      const screenshot = await this.page.screenshot({ fullPage: false });
      this.stepCounter.value++;
      const card = renderCard(this.stepCounter.value, type, description, code, screenshot, false);
      await this.attachFn(card, 'text/html');
    } catch {}
  }

  protected async waitForLocator(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  protected async fillField(
    locator: Locator,
    value: string,
    fieldLabel = 'campo',
    masked = false,
  ): Promise<void> {
    const displayValue = masked ? '***' : value.length > 0 ? `"${value}"` : '(vacío)';
    await this.captureAction(
      'FILL',
      `Ingresa ${displayValue} en ${fieldLabel}`,
      `locator.fill(${displayValue})`,
      async () => {
        await locator.clear();
        await locator.fill(value);
      },
    );
  }

  protected async clickElement(locator: Locator, elementLabel = 'elemento'): Promise<void> {
    await this.captureAction(
      'CLICK',
      `Hace clic en ${elementLabel}`,
      `locator.click()`,
      async () => { await locator.click(); },
    );
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: `test-results/${name}.png` });
  }
}
