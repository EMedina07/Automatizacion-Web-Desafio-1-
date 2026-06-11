import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { IAttachFn } from '../../core/framework_actions/StepLogger';

const LOGIN_URL = 'https://demoqa.com/login';
const PROFILE_PATH = '/profile';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('#userName');
  private readonly passwordInput = this.page.locator('#password');
  private readonly loginButton = this.page.locator('#login');
  private readonly logoutButton = this.page.locator('#submit');
  private readonly usernameDisplay = this.page.locator('#userName-value');
  private readonly errorOutput = this.page.locator('#output');

  constructor(page: Page, attachFn?: IAttachFn, stepCounter?: { value: number }) {
    super(page, attachFn, stepCounter);
  }

  async navigateToLogin(): Promise<void> {
    await this.navigate(LOGIN_URL);
  }

  async enterUsername(username: string): Promise<void> {
    await this.fillField(this.usernameInput, username, 'Username');
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillField(this.passwordInput, password, 'Password', true);
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton, 'Login button');
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async assertLoginSuccess(): Promise<void> {
    await this.assertCapture(
      'User is redirected to the profile page after login',
      `expect(page.url()).toContain('${PROFILE_PATH}')`,
      async () => {
        await this.page.waitForURL(`**${PROFILE_PATH}`, { timeout: 15_000 });
        expect(this.page.url()).toContain(PROFILE_PATH);
      },
    );
  }

  async assertUsernameDisplayed(expectedUsername: string): Promise<void> {
    await this.assertCapture(
      `Username "${expectedUsername}" is visible in the profile`,
      `expect(#userName-value).toContainText('${expectedUsername}')`,
      async () => {
        await expect(this.usernameDisplay).toBeVisible({ timeout: 10_000 });
        await expect(this.usernameDisplay).toContainText(expectedUsername);
      },
    );
  }

  async assertLogoutButtonVisible(): Promise<void> {
    await this.assertCapture(
      'Log Out button is visible — user session is active',
      `expect(#submit).toBeVisible()`,
      async () => {
        await expect(this.logoutButton).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  async assertInvalidCredentialsError(): Promise<void> {
    await this.assertCapture(
      '"Invalid username or password!" error message is displayed',
      `expect(#output).toContainText('Invalid username or password!')`,
      async () => {
        await expect(this.errorOutput).toContainText('Invalid username or password!', {
          timeout: 10_000,
        });
      },
    );
  }

  async assertRemainsOnLoginPage(): Promise<void> {
    await this.assertCapture(
      'User remains on the login page after failed login',
      `expect(page.url()).toContain('/login')`,
      async () => {
        expect(this.page.url()).toContain('/login');
      },
    );
  }
}
