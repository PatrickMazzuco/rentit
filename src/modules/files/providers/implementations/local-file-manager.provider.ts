import { Provider } from "@nestjs/common";
import { ProviderToken } from "@shared/enums/provider-token.enum";
import { randomBytes } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

import { IFileManager } from "../file-manager.interface";

export class LocalFileManager implements IFileManager {
  private basePath: string;

  constructor() {
    this.basePath = path.join(__dirname, "../../../../../../", "tmp");
  }

  async upload(dir: string, file: Express.Multer.File): Promise<string> {
    const fileName =
      randomBytes(16).toString("hex") + path.extname(file.originalname);

    const filePath = path.join(this.basePath, dir, fileName);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, file.buffer);

    return fileName;
  }

  async uploadMultiple(
    dir: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const filenames = await Promise.all(
      files.map(async (file) => {
        return this.upload(dir, file);
      }),
    );

    return filenames;
  }

  async delete(dir: string, filename: string): Promise<void> {
    const filePath = path.join(this.basePath, dir, filename);

    await fs.promises.unlink(filePath).catch((err) => {
      if (err.code !== "ENOENT") {
        throw err;
      }
    });
  }

  async deleteMultiple(dir: string, filenames: string[]): Promise<void> {
    await Promise.all(
      filenames.map(async (filename) => {
        await this.delete(dir, filename);
      }),
    );
  }
}

export const LocalFileUploaderProvider: Provider = {
  provide: ProviderToken.FILE_MANAGER,
  useClass: LocalFileManager,
};
