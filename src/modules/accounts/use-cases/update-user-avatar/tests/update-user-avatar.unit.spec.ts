import { DeleteFileService } from "@modules/files/services/delete-file/delete-file.service";
import { UploadImagesService } from "@modules/files/services/upload-images/upload-images.service";
import { Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  MockUsersRepository,
  MockUsersRepositoryProvider,
} from "@utils/tests/mocks/accounts";
import { getImageMock } from "@utils/tests/mocks/files/files.mock";

import { UpdateUserAvatarService } from "../update-user-avatar.service";

const mockUploadImagesService = {
  execute: jest.fn(),
};

const MockUploadImageServiceProvider: Provider = {
  provide: UploadImagesService,
  useValue: mockUploadImagesService,
};

const mockDeleteFileService = {
  execute: jest.fn(),
};

const MockDeleteFileServiceProvider: Provider = {
  provide: DeleteFileService,
  useValue: mockDeleteFileService,
};

describe("UpdateUserAvatarService", () => {
  let updateUserAvatarService: UpdateUserAvatarService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateUserAvatarService,
        MockUploadImageServiceProvider,
        MockDeleteFileServiceProvider,
        MockUsersRepositoryProvider,
      ],
    }).compile();

    updateUserAvatarService = moduleRef.get<UpdateUserAvatarService>(
      UpdateUserAvatarService,
    );
  });

  it("should be able to update a user's avatar", async () => {
    const avatar = getImageMock();
    const avatarPath = "test.jpg";

    jest
      .spyOn(mockUploadImagesService, "execute")
      .mockResolvedValue({ filePaths: [avatarPath] });
    jest.spyOn(mockDeleteFileService, "execute").mockResolvedValue(null);
    jest.spyOn(MockUsersRepository, "update").mockResolvedValue(null);

    await expect(
      updateUserAvatarService.execute({
        avatar,
        userId: "user-id",
      }),
    ).resolves.not.toThrow();
  });
});
