import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { RentalErrorMessage } from "@modules/rentals/errors/rental-error-messages.enum";
import { Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "@shared/decorators/auth-user.decorator";
import { JWTAuthGuard } from "@shared/decorators/jwt-auth-guard.decorator";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { ReturnRentedCarService } from "./return-rented-car.service";

@ApiTags("rentals")
@Controller("rentals")
@JWTAuthGuard()
export class ReturnRentedCarController {
  constructor(
    private readonly returnRentedCarService: ReturnRentedCarService,
  ) {}

  @Post(":id/return")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Car successfully returned",
    type: RentalDTO,
  })
  @ApiNotFoundResponse({
    description: RentalErrorMessage.NOT_FOUND,
    type: HttpExceptionDTO,
  })
  async handle(
    @Param() { id }: FindByIdDTO,
    @AuthUser() user: UserDTO,
  ): Promise<RentalDTO> {
    return this.returnRentedCarService.execute({
      rentalId: id,
      user,
    });
  }
}
