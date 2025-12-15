import * as fs from "fs";
import * as path from "path";
import { Logger } from "./logger";

export class FileUtils {
  /**
   * 读取文件内容
   */
  public static readFile(filePath: string): string | null {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8");
      }
    } catch (error) {
      Logger.log(`Error reading file ${filePath}: ${error}`);
    }
    return null;
  }

  /**
   * 读取目录下所有指定扩展名的文件内容
   */
  public static readFilesFromDir(dirPath: string, extension: string): string[] {
    const contents: string[] = [];
    try {
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);
        const matchedFiles = files.filter((file) => file.endsWith(extension));

        for (const file of matchedFiles) {
          const content = this.readFile(path.join(dirPath, file));
          if (content?.trim()) {
            contents.push(content.trim());
          }
        }
      }
    } catch (error) {
      Logger.log(`Error reading files from ${dirPath}: ${error}`);
    }
    return contents;
  }
}
