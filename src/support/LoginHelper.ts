import { Page } from 'playwright';
import { LoginPage } from '../pages/LoginPage';

export class LoginHelper {
  static async loginAs(page: Page, username: string, password: string): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();
    await loginPage.assertOnDashboard();
  }
}
