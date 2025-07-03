import path from "path";
import * as fs from "fs";

export class TestData {
  static getJson(fileName: string) {
    const cookiesFilePath = path.join(
      __dirname,
      `../test-data/${fileName}.json`
    );
    return JSON.parse(fs.readFileSync(cookiesFilePath, "utf-8"));
  }
}
