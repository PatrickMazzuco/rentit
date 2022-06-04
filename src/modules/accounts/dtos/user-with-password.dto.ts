import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { UserDTO } from "./user.dto";

export class UserWithPasswordDTO extends UserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
