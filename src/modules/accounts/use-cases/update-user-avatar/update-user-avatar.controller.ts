import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { Body, Controller, HttpCode, HttpStatus, Put } from "@nestjs/common";
import { ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "@shared/decorators/auth-user.decorator";

import { UpdateUserAvatarBodyDTO } from "./dtos/update-user-avatar-body.dto";
import { UpdateUserAvatarService } from "./update-user-avatar.service";

@ApiTags("users")
@Controller("users")
export class UpdateUserAvatarController {
  constructor(
    private readonly updateUserAvatarService: UpdateUserAvatarService,
  ) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "User avatar successfully updated",
  })
  async handle(
    @Body() { avatar }: UpdateUserAvatarBodyDTO,
    @AuthUser() { id }: UserDTO,
  ): Promise<void> {
    return this.updateUserAvatarService.execute({
      userId: id,
      avatar,
    });
  }
}
