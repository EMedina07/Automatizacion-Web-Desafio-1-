import { After, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { launchOptions, contextOptions } from '../config/browser.config';
import { CustomWorld } from './world';

setDefaultTimeout(60_000);

BeforeAll(function () {
  fs.mkdirSync(path.join('test-results', 'traces'), { recursive: true });
  fs.mkdirSync(path.join('test-results', 'videos'), { recursive: true });
});

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch(launchOptions);
  this.context = await this.browser.newContext(contextOptions);

  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  this.page = await this.context.newPage();

  this.consoleLogs = [];
  this.page.on('console', (msg) => {
    if (msg.type() === 'error') {
      this.consoleLogs.push(`[console.error] ${msg.text()}`);
    }
  });
  this.page.on('pageerror', (err) => {
    this.consoleLogs.push(`[page.error] ${err.message}`);
  });
});

After(async function (this: CustomWorld, scenario) {
  const failed = scenario.result?.status === 'FAILED';
  const willBeRetried = (scenario.result as { willBeRetried?: boolean })?.willBeRetried ?? false;
  const scenarioSlug = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase();
  const filePrefix = `${scenarioSlug}-${scenario.pickle.id.slice(0, 8)}`;

  if (failed && !willBeRetried) {
    // Final failure — save all evidence
    const screenshot = await this.page?.screenshot({ fullPage: true });
    if (screenshot) this.attach(screenshot, 'image/png');

    const currentUrl = this.page?.url();
    if (currentUrl) this.attach(`URL al fallar: ${currentUrl}`, 'text/plain');

    if (this.consoleLogs.length > 0) {
      this.attach(`Errores de consola:\n${this.consoleLogs.join('\n')}`, 'text/plain');
    }

    await this.context?.tracing.stop({
      path: path.join('test-results', 'traces', `${filePrefix}.zip`),
    });

    const videoPath = await this.page?.video()?.path();
    await this.context?.close();
    await this.browser?.close();

    if (videoPath && fs.existsSync(videoPath)) {
      const dest = path.join('test-results', 'videos', `${filePrefix}.webm`);
      fs.renameSync(videoPath, dest);
      this.attach(`Video del fallo: ${path.resolve(dest)}`, 'text/plain');
    }
  } else if (failed && willBeRetried) {
    // Intermediate failure — discard evidence and prepare clean slate for retry
    const videoPath = await this.page?.video()?.path();
    await this.context?.tracing.stop();
    await this.context?.close();
    await this.browser?.close();

    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
  } else {
    // Passed (first attempt or successful retry)
    await this.context?.tracing.stop();
    await this.context?.close();
    await this.browser?.close();
  }
});
