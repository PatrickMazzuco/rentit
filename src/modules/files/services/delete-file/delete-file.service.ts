import { Inject, Injectable } from "@nestjs/common";
import { ProviderToken } from "@shared/enums/provider-token.enum";

import { IFileManager } from "../../providers/file-manager.interface";
import { DeleteFileDTO } from "./dtos/delete-file.dto";

@Injectable()
export class DeleteFileService {
  constructor(
    @Inject(ProviderToken.FILE_MANAGER)
    private readonly fileManager: IFileManager,
  ) {}

  async execute({ directory, filename }: DeleteFileDTO): Promise<void> {
    await this.fileManager.delete(directory, filename);
  }
}
