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
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase();

  if (failed) {
    const screenshot = await this.page?.screenshot({ fullPage: true });
    if (screenshot) this.attach(screenshot, 'image/png');

    const currentUrl = this.page?.url();
    if (currentUrl) this.attach(`URL al fallar: ${currentUrl}`, 'text/plain');

    if (this.consoleLogs.length > 0) {
      this.attach(`Errores de consola:\n${this.consoleLogs.join('\n')}`, 'text/plain');
    }

    await this.context?.tracing.stop({
      path: path.join('test-results', 'traces', `${scenarioName}.zip`),
    });

    // get video path before closing context (file is finalized on close)
    const videoPath = await this.page?.video()?.path();

    await this.context?.close();
    await this.browser?.close();

    if (videoPath && fs.existsSync(videoPath)) {
      const dest = path.join('test-results', 'videos', `${scenarioName}.webm`);
      fs.renameSync(videoPath, dest);
      this.attach(`Video del fallo: ${path.resolve(dest)}`, 'text/plain');
    }
  } else {
    await this.context?.tracing.stop();
    await this.context?.close();
    await this.browser?.close();
  }
});
