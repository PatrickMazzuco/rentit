import { Inject, Injectable } from "@nestjs/common";
import { ProviderToken } from "@shared/enums/provider-token.enum";
import { extname } from "node:path";

import { FileUploadError } from "../../errors/file-upload.error";
import { IFileManager } from "../../providers/file-manager.interface";
import { UploadImageResponseDTO } from "./dtos/upload-image-response.dto";
import {
  UploadImageDTO,
  ValidImageFileExtension,
  ValidImageMimeType,
} from "./dtos/upload-image.dto";

@Injectable()
export class UploadImagesService {
  constructor(
    @Inject(ProviderToken.FILE_MANAGER)
    private readonly fileManager: IFileManager,
  ) {}

  async execute({
    directory,
    images,
    validImageMimeTypes,
    validImageFileExtensions,
  }: UploadImageDTO): Promise<UploadImageResponseDTO> {
    images.forEach((image) => {
      const { mimetype, originalname } = image;

      if (validImageFileExtensions) {
        const extension = extname(originalname).replace(".", "");
        const isValidFileExtension = validImageFileExtensions.includes(
          extension as ValidImageFileExtension,
        );

        if (!isValidFileExtension) {
          throw new FileUploadError.InalidFileExtension(
            validImageFileExtensions,
          );
        }
      }

      if (validImageMimeTypes) {
        const isValidMimeType = validImageMimeTypes.includes(
          mimetype as ValidImageMimeType,
        );

        if (!isValidMimeType) {
          throw new FileUploadError.InalidFileMimeType(validImageMimeTypes);
        }
      }
    });

    const filePaths = await this.fileManager.uploadMultiple(directory, images);

    return {
      filePaths,
    };
  }
}
