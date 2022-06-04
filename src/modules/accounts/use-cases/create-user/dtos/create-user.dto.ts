import { UserWithPasswordDTO } from "@modules/accounts/dtos/user-with-password.dto";
import { PickType } from "@nestjs/swagger";

export class CreateUserDTO extends PickType(UserWithPasswordDTO, [
  "name",
  "username",
  "password",
  "email",
  "driversLicense",
  "avatar",
]) {}
