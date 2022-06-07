import { Module } from "@nestjs/common";

import { LocalFileUploaderProvider } from "./providers/implementations/local-file-manager.provider";
import { DeleteFileService } from "./services/delete-file/delete-file.service";
import { UploadImageService } from "./services/upload-image/upload-image.service";

@Module({
  imports: [],
  providers: [LocalFileUploaderProvider, UploadImageService, DeleteFileService],
  exports: [LocalFileUploaderProvider, UploadImageService, DeleteFileService],
})
export class FilesModule {}
