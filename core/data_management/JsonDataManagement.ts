import * as fs from 'fs';
import * as path from 'path';

export class JsonDataManagement {
  private static readJson<T>(env: string, fileName: string): T[] {
    const filePath = path.resolve(__dirname, `../../jsonData/${env}/${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
  }

  static getById<T extends { id: string }>(env: string, fileName: string, id: string): T {
    const records = this.readJson<T>(env, fileName);
    const record = records.find((r) => r.id === id);
    if (!record) {
      throw new Error(`Record with id "${id}" not found in ${fileName}.json (env: ${env})`);
    }
    return record;
  }

  static getByField<T>(env: string, fileName: string, field: keyof T, value: string): T {
    const records = this.readJson<T>(env, fileName);
    const record = records.find((r) => String(r[field]) === value);
    if (!record) {
      throw new Error(
        `Record with ${String(field)}="${value}" not found in ${fileName}.json (env: ${env})`
      );
    }
    return record;
  }
}
