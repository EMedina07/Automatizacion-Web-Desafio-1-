import { Given, Then, When } from "@cucumber/cucumber";
import { ContactUsPage } from "../../pages/ContactUsPage";
import { BrowserActions } from "../../../../centerManagement/framenwork_actions/BrowserActions";
import { setDefaultTimeout } from '@cucumber/cucumber';
import { JsonDataManagement } from "../../../../centerManagement/data_management/JsonDataManagement";

import enviroments from '../../../../centerManagement/settings/EnvironmentSettings'; 

setDefaultTimeout(60000);
let contactUs: ContactUsPage;

Given('el usuario navega al sitio elaniin', async function () {
    contactUs = await new ContactUsPage(await BrowserActions.getPage());
});

When('navega a la seccion Contact Us', async function () {
    await contactUs.goToContactUs();
});

When('completa el formulario con user {string}', async function (userId: string) {
   const userData = await JsonDataManagement.getUserById(enviroments.env, 'users', userId);

   await contactUs.enterName(userData.name);
   await contactUs.enterEmail(userData.email);
   await contactUs.enterPhone(userData.country, userData.phone);
   await contactUs.enterSubject(userData.subject);
   await contactUs.enterMessage(userData.message);
});

When('hace clic en Send message', async function () {
    await contactUs.sendMessage();
});

Then('el formulario se envia exitosamente', async function () {
           
    await contactUs.theContactWasComplete();
    await BrowserActions.closeBrowser();
});