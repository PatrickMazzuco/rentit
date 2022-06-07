import { BadRequestException } from "@nestjs/common";

import { FileUploadErrorMessage } from "./file-upload-error-messages.enum";

export namespace FileUploadError {
  export class InalidFileMimeType extends BadRequestException {
    constructor(validImageMimeTypes?: string[]) {
      let message = `${FileUploadErrorMessage.INVALID_FILE_MIME_TYPE}`;

      if (validImageMimeTypes && validImageMimeTypes.length) {
        message += `. Valid mime types are: ${validImageMimeTypes.join(", ")}`;
      }

      super(message);
    }
  }

  export class InalidFileExtension extends BadRequestException {
    constructor(validFileExtensions?: string[]) {
      let message = `${FileUploadErrorMessage.INVALID_FILE_EXTENSION}`;

      if (validFileExtensions && validFileExtensions.length) {
        message += `. Valid extensions are: ${validFileExtensions.join(", ")}`;
      }

      super(message);
    }
  }
}
