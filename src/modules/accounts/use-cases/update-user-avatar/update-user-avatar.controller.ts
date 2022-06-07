import { UserDTO } from "@modules/accounts/dtos/user.dto";
import {
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
} from "@nestjs/common";
import { ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "@shared/decorators/auth-user.decorator";
import { FileUploadEndpoint } from "@shared/decorators/file-upload.decorator";
import { JWTAuthGuard } from "@shared/decorators/jwt-auth-guard.decorator";

import { UpdateUserAvatarService } from "./update-user-avatar.service";

@ApiTags("users")
@Controller("users")
@JWTAuthGuard()
export class UpdateUserAvatarController {
  constructor(
    private readonly updateUserAvatarService: UpdateUserAvatarService,
  ) {}

  @Patch("avatar")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "User avatar successfully updated",
  })
  @FileUploadEndpoint("avatar")
  async handle(
    @UploadedFile() avatar: Express.Multer.File,
    @AuthUser() { id }: UserDTO,
  ): Promise<void> {
    return this.updateUserAvatarService.execute({
      userId: id,
      avatar,
    });
  }
}
