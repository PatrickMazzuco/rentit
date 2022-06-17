import { Module } from "@nestjs/common";

import { LocalFileUploaderProvider } from "./providers/implementations/local-file-manager.provider";
import { DeleteFileService } from "./services/delete-file/delete-file.service";
import { UploadImagesService } from "./services/upload-images/upload-images.service";

@Module({
  imports: [],
  providers: [
    LocalFileUploaderProvider,
    UploadImagesService,
    DeleteFileService,
  ],
  exports: [LocalFileUploaderProvider, UploadImagesService, DeleteFileService],
})
export class FilesModule {}
