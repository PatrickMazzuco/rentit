export interface IFileManager {
  upload(dir: string, file: Express.Multer.File): Promise<string>;
  uploadMultiple(dir: string, files: Express.Multer.File[]): Promise<string[]>;
  delete(dir: string, filename: string): Promise<void>;
  deleteMultiple(dir: string, filenames: string[]): Promise<void>;
}
