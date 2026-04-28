const { execSync } = require('child_process');

const env = process.argv[2] || 'qa';
const extraEnv = process.argv[3] || '';

const cucumberCmd = extraEnv
  ? `cross-env ENV=${env} ${extraEnv} cucumber-js`
  : `cross-env ENV=${env} cucumber-js`;

let testExitCode = 0;

try {
  execSync(cucumberCmd, { stdio: 'inherit' });
} catch (e) {
  testExitCode = e.status || 1;
}

try {
  execSync(`cross-env ENV=${env} ts-node --transpile-only report.ts`, { stdio: 'inherit' });
} catch (_) {}

process.exit(testExitCode);
