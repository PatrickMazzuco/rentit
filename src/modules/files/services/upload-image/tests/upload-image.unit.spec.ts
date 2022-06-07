import { FileUploadError } from "@modules/files/errors/file-upload.error";
import { Test } from "@nestjs/testing";
import {
  MockFileUploader,
  MockFileUploaderProvider,
} from "@utils/tests/mocks/files";
import { getImageMock } from "@utils/tests/mocks/files/files.mock";

import { UploadImageService } from "../upload-image.service";

describe("UploadImageService", () => {
  let uploadImageService: UploadImageService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UploadImageService, MockFileUploaderProvider],
    }).compile();

    uploadImageService = moduleRef.get<UploadImageService>(UploadImageService);
  });

  it("should be able to upload an image", async () => {
    const imageFile = getImageMock();
    const filePath = "test.jpg";

    jest.spyOn(MockFileUploader, "upload").mockResolvedValue(filePath);

    const createdCategory = await uploadImageService.execute({
      directory: "dir",
      image: imageFile,
      validImageFileExtensions: ["jpg"],
      validImageMimeTypes: ["image/jpg"],
    });

    expect(createdCategory).toHaveProperty("filePath", filePath);
  });

  it("should not be able to upload an image with invalid extension", async () => {
    const imageFile = getImageMock();

    imageFile.originalname = "test.gif";

    await expect(
      uploadImageService.execute({
        directory: "dir",
        image: imageFile,
        validImageFileExtensions: ["jpg"],
        validImageMimeTypes: ["image/jpg"],
      }),
    ).rejects.toThrow(FileUploadError.InalidFileExtension);
  });

  it("should not be able to upload an image with invalid mime type", async () => {
    const imageFile = getImageMock();

    imageFile.mimetype = "image/gif";

    await expect(
      uploadImageService.execute({
        directory: "dir",
        image: imageFile,
        validImageFileExtensions: ["jpg"],
        validImageMimeTypes: ["image/jpg"],
      }),
    ).rejects.toThrow(FileUploadError.InalidFileMimeType);
  });
});
