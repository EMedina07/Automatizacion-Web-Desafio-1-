import * as path from 'path';
import { BrowserContextOptions, LaunchOptions } from 'playwright';

const isCI = !!process.env.CI;
const shouldRecordVideo = isCI || process.env.RECORD_VIDEO === 'true';

export const launchOptions: LaunchOptions = {
  headless: isCI,
  args: isCI ? [] : ['--start-maximized'],
};

export const contextOptions: BrowserContextOptions = {
  viewport: isCI ? { width: 1280, height: 720 } : null,
  ...(shouldRecordVideo && {
    recordVideo: {
      dir: path.join('test-results', 'videos'),
      size: { width: 1280, height: 720 },
    },
  }),
};
