import { Test } from "@nestjs/testing";
import {
  MockFileUploader,
  MockFileUploaderProvider,
} from "@utils/tests/mocks/files";
import { getImageMock } from "@utils/tests/mocks/files/files.mock";

import { DeleteFileService } from "../delete-file.service";

describe("DeleteFileService", () => {
  let deleteFileService: DeleteFileService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DeleteFileService, MockFileUploaderProvider],
    }).compile();

    deleteFileService = moduleRef.get<DeleteFileService>(DeleteFileService);
  });

  it("should be able to delete a file", async () => {
    const imageFile = getImageMock();

    jest.spyOn(MockFileUploader, "delete").mockResolvedValue();

    await expect(
      deleteFileService.execute({
        directory: "dir",
        filename: imageFile.filename,
      }),
    ).resolves.not.toThrow();
  });
});
