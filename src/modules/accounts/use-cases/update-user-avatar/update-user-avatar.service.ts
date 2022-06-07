import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { DeleteFileService } from "@modules/files/services/delete-file/delete-file.service";
import {
  ValidImageFileExtension,
  ValidImageMimeType,
} from "@modules/files/services/upload-image/dtos/upload-image.dto";
import { UploadImageService } from "@modules/files/services/upload-image/upload-image.service";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { UpdateUserAvatarDTO } from "./dtos/update-user-avatar.dto";

export const validAvatarMimeTypes: ValidImageMimeType[] = [
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export const validAvatarFileExtensions: ValidImageFileExtension[] = [
  "png",
  "jpeg",
  "jpg",
];

export const avatarsDir = "avatars";

@Injectable()
export class UpdateUserAvatarService {
  constructor(
    @Inject(RepositoryToken.USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    private readonly uploadImageService: UploadImageService,
    private readonly deleteFileService: DeleteFileService,
  ) {}

  public async execute({ userId, avatar }: UpdateUserAvatarDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    await this.deleteFileService.execute({
      directory: avatarsDir,
      filename: user.avatar,
    });

    const { filePath: avatarFileName } = await this.uploadImageService.execute({
      directory: avatarsDir,
      image: avatar,
      validImageMimeTypes: validAvatarMimeTypes,
      validImageFileExtensions: validAvatarFileExtensions,
    });

    user.avatar = avatarFileName;

    await this.userRepository.update(user);
  }
}
