import { HttpExceptionDTO } from "@errors/http/http-exception.dto";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthenticateUserService } from "./authenticate-user.service";
import { AuthenticateUserBodyDTO } from "./dtos/authenticate-user-body.dto";
import { AuthenticateUserResponseDTO } from "./dtos/authenticate-user-response.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthenticateController {
  constructor(
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Successfully authenticated",
    type: AuthenticateUserResponseDTO,
  })
  @ApiBadRequestResponse({
    description: AuthErrorMessage.INVALID_CREDENTIALS,
    type: HttpExceptionDTO,
  })
  async handle(
    @Body() data: AuthenticateUserBodyDTO,
  ): Promise<AuthenticateUserResponseDTO> {
    return this.authenticateUserService.execute(data);
  }
}
