import { expect, Page } from "@playwright/test";
import { COUNTRY_MAP } from "../../../centerManagement/framenwork_actions/Contants";

import enviroments from '../../../centerManagement/settings/EnvironmentSettings'; 

export class ContactUsPage{

    private namePlaceholder = 'name';
    private emailPlaceholder = 'booster@example.com';
    private phonePlaceholder = '00 0000 0000';
    private subjectPlaceholder = 'Subject';
    private messagePlaceholder = 'Type your message';

    constructor(private page: Page){
        this.page = page;
    }

    async goToContactUs(){
        await this.page.goto(enviroments.baseURL)

        await this.page.getByRole('navigation').getByRole('link', { name: 'Contact Us' }).click();
        await expect(this.page.locator('h1')).toContainText('Get in touch with us');
    }

    async enterName(name: string){
        await this.page.getByPlaceholder(this.namePlaceholder).fill(name);
    }

    async enterEmail(email: string){
        await this.page.getByPlaceholder(this.emailPlaceholder).fill(email)
    }

    async enterPhone(country: string, phone: string){
        await this.page.locator('#countryCode').selectOption(COUNTRY_MAP[country]);
        await this.page.getByPlaceholder(this.phonePlaceholder).fill(phone)
    }

    async enterSubject(subject: string){
        await this.page.getByPlaceholder(this.subjectPlaceholder).fill(subject)
    }

    async enterMessage(message: string){
        await this.page.getByPlaceholder(this.messagePlaceholder).fill(message)
    }

    async sendMessage(){
        await this.page.getByText('Send message').click();
    }

    async theContactWasComplete(){
        await expect(this.page.getByRole('heading', { name: 'Thank you for reaching out' })).toBeVisible();
    }
}