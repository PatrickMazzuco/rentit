import { createMock } from "@golevelup/ts-jest";
import { IFileManager } from "@modules/files/providers/file-manager.interface";
import { Provider } from "@nestjs/common";
import { ProviderToken } from "@shared/enums/provider-token.enum";

export const MockFileUploader: IFileManager = createMock<IFileManager>();

export const MockFileUploaderProvider: Provider = {
  provide: ProviderToken.FILE_MANAGER,
  useValue: MockFileUploader,
};
