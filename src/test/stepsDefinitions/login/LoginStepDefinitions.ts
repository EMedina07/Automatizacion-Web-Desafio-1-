import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { JsonDataManagement } from '../../../../core/data_management/JsonDataManagement';
import environments from '../../../../core/settings/EnvironmentSettings';
import { CustomWorld } from '../../../support/world';
import { LoginData } from '../../../../core/interfaces/LoginData';

interface LoginWorld extends CustomWorld {
  loginResponseTime?: number;
}

Given('el usuario está en la página de login', async function (this: CustomWorld) {
  await this.getPage(LoginPage).navigateTo();
});

When('el usuario inicia sesión con el usuario {string}', async function (this: CustomWorld, dataId: string) {
  const data = JsonDataManagement.getById<LoginData>(environments.env, 'login', dataId);
  const loginPage = this.getPage(LoginPage);
  await loginPage.fillUsername(data.username);
  await loginPage.fillPassword(data.password);
  await loginPage.clickLogin();
});

Then('el usuario es redirigido al dashboard', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertOnDashboard();
});

Then('se muestran los mensajes de campo requerido', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertFieldRequired();
});

Then('se muestra el error de credenciales inválidas', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertInvalidCredentialsError();
});

When('el usuario intenta acceder directamente al dashboard sin autenticarse', async function (this: CustomWorld) {
  await this.getPage(LoginPage).attemptDirectDashboardAccess();
});

Then('el sistema redirige a la página de login', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertOnLoginPage();
});

Then('el sistema no ejecuta el payload y muestra error de credenciales', async function (this: CustomWorld) {
  await this.getPage(LoginPage).assertXssNotExecuted();
});

When('el usuario inicia sesión con {string} y se registra el tiempo de respuesta', async function (this: LoginWorld, dataId: string) {
  const data = JsonDataManagement.getById<LoginData>(environments.env, 'login', dataId);
  const elapsed = await this.getPage(LoginPage).loginWithTiming(data.username, data.password);
  this.attach(`Tiempo de respuesta: ${elapsed}ms`, 'text/plain');
  this.loginResponseTime = elapsed;
});

Then('el tiempo de respuesta es menor a {int} milisegundos', function (this: LoginWorld, threshold: number) {
  expect(this.loginResponseTime).toBeDefined();
  expect(this.loginResponseTime!).toBeLessThan(threshold);
});
