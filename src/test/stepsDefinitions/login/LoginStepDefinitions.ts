import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/LoginPage';
import { JsonDataManagement } from '../../../../core/data_management/JsonDataManagement';
import { UserData } from '../../../../core/interfaces/UserData';
import environments from '../../../../core/settings/EnvironmentSettings';

Given('the user is on the login page', async function (this: CustomWorld) {
  await this.getPage(LoginPage).navigateToLogin();
});

When(
  'the user logs in with credentials {string}',
  async function (this: CustomWorld, userId: string) {
    const user = JsonDataManagement.getById<UserData>(environments.env, 'users', userId);
    await this.getPage(LoginPage).login(user.username, user.password);
  },
);

Then('the user is redirected to the profile page', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertLoginSuccess();
});

Then('the session username is visible in the profile', async function (this: CustomWorld) {
  const user = JsonDataManagement.getById<UserData>(environments.env, 'users', 'valid');
  await this.getPage(LoginPage).assertUsernameDisplayed(user.username);
});

Then('an invalid credentials error message is displayed', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertInvalidCredentialsError();
});

Then('the user remains on the login page', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertRemainsOnLoginPage();
});
