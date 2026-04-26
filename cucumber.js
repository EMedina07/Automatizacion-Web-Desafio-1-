const fs = require('fs');

fs.mkdirSync('reports', { recursive: true });

module.exports = {
  default: {
    require: ['src/support/**/*.ts', 'src/test/stepsDefinitions/**/*.ts'],
    format: ['json:reports/cucumber-report.json', 'summary'],
    paths: ['src/test/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    parallel: process.env.PARALLEL ? parseInt(process.env.PARALLEL) : 4,
    retry: process.env.CI ? 1 : 0,
    publishQuiet: true,
  },
};
