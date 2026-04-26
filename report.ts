import report from 'multiple-cucumber-html-reporter';
import { execSync } from 'child_process';
import path from 'path';

report.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  reportName: 'Cucumber Report',
  pageTitle: 'Resultados de pruebas',
  displayDuration: true,
  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest',
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '11 Enterprise',
    },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'Workflow' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Environment', value: (process.env.ENV ?? 'unknown').toUpperCase() },
      { label: 'SDET Engineer', value: 'Ezequiel Medina Adames' },
      { label: 'Executed', value: new Date().toLocaleString() },
    ],
  },
});

const reportPath = path.resolve('reports', 'html', 'index.html');
console.log(`\nReporte generado: ${reportPath}`);

if (!process.env.CI) {
  try {
    if (process.platform === 'win32') {
      execSync(`cmd /c start "" "${reportPath}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${reportPath}"`);
    } else {
      execSync(`xdg-open "${reportPath}"`);
    }
  } catch {
    console.log('Abre manualmente el reporte en tu browser.');
  }
}
