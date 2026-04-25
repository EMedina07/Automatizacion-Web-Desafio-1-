import { Given, Then, When } from '@cucumber/cucumber';
import { ContactUsPage } from '../../../pages/ContactUsPage';
import { JsonDataManagement } from '../../../../centerManagement/data_management/JsonDataManagement';
import environments from '../../../../centerManagement/settings/EnvironmentSettings';
import { CustomWorld } from '../../../support/world';

Given('el usuario navega al sitio elaniin', async function (this: CustomWorld) {
  this.getPage(ContactUsPage);
});

When('navega a la seccion Contact Us', async function (this: CustomWorld) {
  await this.getPage(ContactUsPage).goToContactUs();
  await this.getPage(ContactUsPage).assertOnContactPage();
});

When('completa el formulario con user {string}', async function (this: CustomWorld, userId: string) {
  const userData = JsonDataManagement.getUserById(environments.env, 'users', userId);
  const contactUs = this.getPage(ContactUsPage);

  await contactUs.enterName(userData.name);
  await contactUs.enterEmail(userData.email);
  await contactUs.enterPhone(userData.country, userData.phone);
  await contactUs.enterSubject(userData.subject);
  await contactUs.enterMessage(userData.message);
});

When('hace clic en Send message', async function (this: CustomWorld) {
  await this.getPage(ContactUsPage).sendMessage();
});

Then('el formulario se envia exitosamente', async function (this: CustomWorld) {
  await this.getPage(ContactUsPage).assertSubmissionSuccess();
});
