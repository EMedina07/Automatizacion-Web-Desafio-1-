import { expect, Page } from '@playwright/test';
import { COUNTRY_MAP } from '../../centerManagement/framework_actions/constants';
import environments from '../../centerManagement/settings/EnvironmentSettings';

export class ContactUsPage {

  constructor(private page: Page) {}

  async goToContactUs() {
    await this.page.goto(environments.baseURL);
    await this.page.getByRole('navigation').getByRole('link', { name: 'Contact Us' }).click();
  }

  async enterName(name: string) {
    await this.page.getByPlaceholder('name').fill(name);
  }

  async enterEmail(email: string) {
    await this.page.getByPlaceholder('booster@example.com').fill(email);
  }

  async enterPhone(country: string, phone: string) {
    await this.page.locator('#countryCode').selectOption(COUNTRY_MAP[country]);
    await this.page.getByPlaceholder('00 0000 0000').fill(phone);
  }

  async enterSubject(subject: string) {
    await this.page.getByPlaceholder('Subject').fill(subject);
  }

  async enterMessage(message: string) {
    await this.page.getByPlaceholder('Type your message').fill(message);
  }

  async sendMessage() {
    await this.page.getByRole('button', { name: 'Send message' }).click();
  }

  // --- Assertions ---

  async assertOnContactPage() {
    await expect(this.page.getByRole('heading', { level: 1, name: 'Get in touch with us' })).toBeVisible();
  }

  async assertSubmissionSuccess() {
    await expect(this.page.getByRole('heading', { name: 'Thank you for reaching out' })).toBeVisible();
  }
}
