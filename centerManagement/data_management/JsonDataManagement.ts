import * as fs from 'fs';
import * as path from 'path';

export class JsonDataManagement {

    static getUserById(env: string, jsonData: string, userId: string) {
        const filePath = path.resolve(__dirname, `../../jsonData/${env}/${jsonData}.json`);
        const jsonFile = fs.readFileSync(filePath, 'utf-8');
        const user = JSON.parse(jsonFile).find((u: { id: string }) => u.id === userId);
        return user;
    }

    static getUserByName(env: string, jsonData: string, username: string) {
        const filePath = path.resolve(__dirname, `../../jsonData/${env}/${jsonData}.json`);
        const jsonFile = fs.readFileSync(filePath, 'utf-8');
        const user = JSON.parse(jsonFile).find((u: { username: string }) => u.username === username);
        return user;
    }
}