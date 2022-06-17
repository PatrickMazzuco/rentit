import { FileUploadError } from "@modules/files/errors/file-upload.error";
import { Test } from "@nestjs/testing";
import {
  MockFileUploader,
  MockFileUploaderProvider,
} from "@utils/tests/mocks/files";
import { getImageMock } from "@utils/tests/mocks/files/files.mock";

import { UploadImagesService } from "../upload-images.service";

describe("UploadImagesService", () => {
  let uploadImagesService: UploadImagesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UploadImagesService, MockFileUploaderProvider],
    }).compile();

    uploadImagesService =
      moduleRef.get<UploadImagesService>(UploadImagesService);
  });

  it("should be able to upload an image", async () => {
    const imageFile = getImageMock();
    const filePath = "test.jpg";

    jest
      .spyOn(MockFileUploader, "uploadMultiple")
      .mockResolvedValue([filePath]);

    const createdCategory = await uploadImagesService.execute({
      directory: "dir",
      images: [imageFile],
      validImageFileExtensions: ["jpg"],
      validImageMimeTypes: ["image/jpg"],
    });

    expect(createdCategory).toHaveProperty("filePaths", [filePath]);
  });

  it("should not be able to upload an image with invalid extension", async () => {
    const imageFile = getImageMock();

    imageFile.originalname = "test.gif";

    await expect(
      uploadImagesService.execute({
        directory: "dir",
        images: [imageFile],
        validImageFileExtensions: ["jpg"],
        validImageMimeTypes: ["image/jpg"],
      }),
    ).rejects.toThrow(FileUploadError.InalidFileExtension);
  });

  it("should not be able to upload an image with invalid mime type", async () => {
    const imageFile = getImageMock();

    imageFile.mimetype = "image/gif";

    await expect(
      uploadImagesService.execute({
        directory: "dir",
        images: [imageFile],
        validImageFileExtensions: ["jpg"],
        validImageMimeTypes: ["image/jpg"],
      }),
    ).rejects.toThrow(FileUploadError.InalidFileMimeType);
  });
});
