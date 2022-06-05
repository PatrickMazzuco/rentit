import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { UserErrorMessage } from "@modules/accounts/errors/users-error-messages.enum";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { CreateUserService } from "./create-user.service";
import { CreateUserDTO } from "./dtos/create-user.dto";

@ApiTags("users")
@Controller("users")
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "User successfully created",
    type: UserDTO,
  })
  @ApiBadRequestResponse({
    description: UserErrorMessage.ALREADY_EXISTS,
    type: HttpExceptionDTO,
  })
  async handle(@Body() data: CreateUserDTO): Promise<UserDTO> {
    return this.createUserService.execute(data);
  }
}
