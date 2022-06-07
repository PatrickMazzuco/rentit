export type ValidImageMimeType =
  | "image/png"
  | "image/jpeg"
  | "image/jpg"
  | "image/gif";
export type ValidImageFileExtension = "png" | "jpeg" | "jpg" | "gif";

export class UploadImageDTO {
  directory: string;
  image: Express.Multer.File;
  validImageMimeTypes?: ValidImageMimeType[];
  validImageFileExtensions?: ValidImageFileExtension[];
}
