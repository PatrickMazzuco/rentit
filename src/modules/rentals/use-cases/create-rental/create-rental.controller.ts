import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { RentalErrorMessage } from "@modules/rentals/errors/rental-error-messages.enum";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthUser } from "@shared/decorators/auth-user.decorator";
import { JWTAuthGuard } from "@shared/decorators/jwt-auth-guard.decorator";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { CreateRentalService } from "./create-rental.service";
import { CreateRentalBodyDTO } from "./dtos/create-rental-body.dto";

@ApiTags("rentals")
@Controller("rentals")
@JWTAuthGuard()
export class CreateRentalController {
  constructor(private readonly createRentalService: CreateRentalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Rental successfully created",
    type: RentalDTO,
  })
  @ApiBadRequestResponse({
    description: RentalErrorMessage.CAR_ALREADY_RENTED,
    type: HttpExceptionDTO,
  })
  @ApiNotFoundResponse({
    description: CategoryErrorMessage.NOT_FOUND,
    type: HttpExceptionDTO,
  })
  async handle(
    @Body() data: CreateRentalBodyDTO,
    @AuthUser() { id }: UserDTO,
  ): Promise<RentalDTO> {
    return this.createRentalService.execute({
      userId: id,
      ...data,
    });
  }
}
