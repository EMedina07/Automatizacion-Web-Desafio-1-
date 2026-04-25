import * as fs from 'fs';
import * as path from 'path';

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
}

export class JsonDataManagement {

  private static readJson<T>(env: string, fileName: string): T[] {
    const filePath = path.resolve(__dirname, `../../jsonData/${env}/${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
  }

  static getUserById(env: string, jsonData: string, userId: string): UserData {
    const users = this.readJson<UserData>(env, jsonData);
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error(`User with id "${userId}" not found in ${jsonData}.json (env: ${env})`);
    }
    return user;
  }

  static getUserByName(env: string, jsonData: string, username: string): UserData {
    const users = this.readJson<UserData>(env, jsonData);
    const user = users.find((u) => u.name === username);
    if (!user) {
      throw new Error(`User with name "${username}" not found in ${jsonData}.json (env: ${env})`);
    }
    return user;
  }
}
