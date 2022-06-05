import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

import { UpdateUserAvatarBodyDTO } from "./update-user-avatar-body.dto";

export class UpdateUserAvatarDTO extends UpdateUserAvatarBodyDTO {
  @IsUUID("4")
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
