export interface IFileManager {
  upload(dir: string, file: Express.Multer.File): Promise<string>;
  delete(dir: string, filename: string): Promise<void>;
}
