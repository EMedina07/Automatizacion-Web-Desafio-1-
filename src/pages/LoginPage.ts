import { Locator, Page } from 'playwright';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import environments from '../../core/settings/EnvironmentSettings';

const LOGIN_PATH = '/web/index.php/auth/login';
const DASHBOARD_PATH = '/web/index.php/dashboard/index';
const DASHBOARD_URL_FRAGMENT = '**/dashboard/index';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly fieldErrorMessages: Locator;
  private readonly credentialsError: Locator;
  private readonly sidebarMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.fieldErrorMessages = page.locator('.oxd-input-field-error-message');
    this.credentialsError = page.locator('.orangehrm-login-error');
    this.sidebarMenu = page.locator('div.oxd-main-menu');
  }

  async navigateTo(): Promise<void> {
    await this.navigate(`${environments.baseURL}${LOGIN_PATH}`);
    await this.waitForLocator(this.loginButton);
  }

  async fillUsername(value: string): Promise<void> {
    await this.fillField(this.usernameInput, value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.fillField(this.passwordInput, value);
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  async assertOnDashboard(): Promise<void> {
    await this.page.waitForURL(DASHBOARD_URL_FRAGMENT, { timeout: 10_000 });
    await this.waitForLocator(this.sidebarMenu);
  }

  async assertOnLoginPage(): Promise<void> {
    await this.waitForLocator(this.loginButton);
    expect(this.page.url()).toContain('/auth/login');
  }

  async assertFieldRequired(): Promise<void> {
    await this.fieldErrorMessages.first().waitFor({ state: 'visible' });
    const errors = await this.fieldErrorMessages.allTextContents();
    errors.forEach((text) => expect(text.trim()).toBe('Required'));
  }

  async assertInvalidCredentialsError(): Promise<void> {
    await this.waitForLocator(this.credentialsError, 30_000);
    await expect(this.credentialsError).toContainText('Invalid credentials');
  }

  async assertXssNotExecuted(): Promise<void> {
    const bodyText = await this.page.locator('body').textContent() ?? '';
    expect(bodyText).not.toContain('<script>');
    await this.assertInvalidCredentialsError();
  }

  async attemptDirectDashboardAccess(): Promise<void> {
    await this.page.goto(`${environments.baseURL}${DASHBOARD_PATH}`);
  }

  async loginWithTiming(username: string, password: string): Promise<number> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    const start = Date.now();
    await this.clickLogin();
    await this.assertOnDashboard();
    return Date.now() - start;
  }
}
